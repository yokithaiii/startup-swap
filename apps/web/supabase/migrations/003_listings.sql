-- Таблица листингов
create table public.listings (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,

  -- Basic info
  title               text not null,
  tagline             text,
  description         text not null,
  category            text not null check (category in ('AI_ML','SAAS','ECOMMERCE','WEB3','FINTECH','HEALTHTECH')),
  slug                text not null unique,

  -- Tech stack
  tech_frontend       text[] not null default '{}',
  tech_backend        text[] not null default '{}',
  tech_database       text[] not null default '{}',
  tech_infra          text[] not null default '{}',
  tech_services       text[] not null default '{}',

  -- Pricing
  price               numeric(12,2) not null,
  currency            text not null default 'USD',
  price_negotiable    boolean not null default false,

  -- Metrics (flexible JSON)
  metrics             jsonb not null default '{}',

  -- Status
  status              text not null default 'DRAFT'
                        check (status in ('DRAFT','PENDING_REVIEW','ACTIVE','SOLD','DELISTED','REJECTED')),
  visibility          text not null default 'public'
                        check (visibility in ('public','private','verified_buyers_only')),
  featured            boolean not null default false,

  -- Media
  thumbnail_url       text,
  images              text[] not null default '{}',
  demo_url            text,
  github_url          text,

  -- Stats
  views               integer not null default 0,
  favorites           integer not null default 0,
  inquiries           integer not null default 0,

  -- Timestamps
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  published_at        timestamptz,
  sold_at             timestamptz
);

-- Индексы
create index listings_user_id_idx    on public.listings(user_id);
create index listings_status_idx     on public.listings(status);
create index listings_category_idx   on public.listings(category);
create index listings_price_idx      on public.listings(price);
create index listings_created_at_idx on public.listings(created_at desc);

-- RLS
alter table public.listings enable row level security;

-- Публичные активные листинги видны всем
create policy "Активные листинги видны всем" on public.listings
  for select using (status = 'ACTIVE' and visibility = 'public');

-- Владелец видит все свои листинги
create policy "Владелец видит свои листинги" on public.listings
  for select using (auth.uid() = user_id);

-- Создание — только авторизованные
create policy "Авторизованный создаёт листинг" on public.listings
  for insert with check (auth.uid() = user_id);

-- Редактирование — только владелец (и только не проданные)
create policy "Владелец редактирует листинг" on public.listings
  for update using (auth.uid() = user_id and status != 'SOLD');

-- Удаление — только владелец черновиков
create policy "Владелец удаляет черновик" on public.listings
  for delete using (auth.uid() = user_id and status in ('DRAFT', 'REJECTED', 'DELISTED'));

-- updated_at триггер
create trigger listings_updated_at
  before update on public.listings
  for each row execute procedure public.set_updated_at();

-- Функция генерации slug
create or replace function public.generate_slug(title text)
returns text language plpgsql as $$
declare
  base_slug text;
  final_slug text;
  counter   int := 0;
begin
  base_slug := lower(regexp_replace(trim(title), '[^a-zA-Z0-9\s-]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  base_slug := left(base_slug, 60);

  final_slug := base_slug;
  while exists (select 1 from public.listings where slug = final_slug) loop
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  end loop;

  return final_slug;
end;
$$;
