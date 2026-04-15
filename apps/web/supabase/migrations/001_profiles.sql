-- Таблица профилей пользователей
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text not null,
  first_name  text,
  last_name   text,
  avatar_url  text,
  bio         text,
  company     text,
  website     text,
  twitter     text,
  linkedin    text,
  role        text not null default 'BOTH' check (role in ('BUYER', 'SELLER', 'BOTH', 'ADMIN')),
  reputation  integer not null default 0,
  email_verified    boolean not null default false,
  identity_verified boolean not null default false,
  funds_verified    boolean not null default false,
  total_sales       integer not null default 0,
  total_purchases   integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;

-- Политики
create policy "Профили видны всем" on public.profiles
  for select using (true);

create policy "Пользователь редактирует свой профиль" on public.profiles
  for update using (auth.uid() = id);

-- Триггер: создаём профиль при регистрации
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Триггер: обновляем updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
