-- Таблица избранного
create table public.favorites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  listing_id  uuid not null references public.listings(id) on delete cascade,
  created_at  timestamptz not null default now(),

  constraint favorites_user_listing_unique unique (user_id, listing_id)
);

-- Индексы
create index favorites_user_id_idx    on public.favorites(user_id);
create index favorites_listing_id_idx on public.favorites(listing_id);

-- RLS
alter table public.favorites enable row level security;

-- Пользователь видит только своё избранное
create policy "Пользователь видит своё избранное" on public.favorites
  for select using (auth.uid() = user_id);

-- Добавлять в избранное может только авторизованный пользователь для себя
create policy "Пользователь добавляет в избранное" on public.favorites
  for insert with check (auth.uid() = user_id);

-- Удалять из избранного может только владелец записи
create policy "Пользователь удаляет из избранного" on public.favorites
  for delete using (auth.uid() = user_id);

-- Функция: инкремент счётчика favorites у листинга
create or replace function public.increment_favorites(listing_id uuid)
returns void
language sql
security definer
as $$
  update public.listings
  set favorites = favorites + 1
  where id = listing_id;
$$;

-- Функция: декремент счётчика favorites у листинга (не ниже 0)
create or replace function public.decrement_favorites(listing_id uuid)
returns void
language sql
security definer
as $$
  update public.listings
  set favorites = greatest(favorites - 1, 0)
  where id = listing_id;
$$;
