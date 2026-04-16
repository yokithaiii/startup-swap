-- Таблица офферов
create table public.offers (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references public.listings(id) on delete cascade,
  buyer_id    uuid not null references public.profiles(id) on delete cascade,
  seller_id   uuid not null references public.profiles(id) on delete cascade,

  amount      numeric(12,2) not null,
  currency    text not null default 'USD',
  message     text not null,
  conditions  text,

  status      text not null default 'pending'
                check (status in ('pending', 'accepted', 'rejected', 'countered')),

  expires_at  timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Индексы
create index offers_listing_id_idx on public.offers(listing_id);
create index offers_buyer_id_idx   on public.offers(buyer_id);
create index offers_seller_id_idx  on public.offers(seller_id);
create index offers_status_idx     on public.offers(status);

-- RLS
alter table public.offers enable row level security;

-- Покупатель видит свои офферы
create policy "Покупатель видит свои офферы" on public.offers
  for select using (auth.uid() = buyer_id);

-- Продавец видит офферы на свои листинги
create policy "Продавец видит офферы на свои листинги" on public.offers
  for select using (auth.uid() = seller_id);

-- Создавать оффер может только авторизованный (не на свой листинг)
create policy "Авторизованный создаёт оффер" on public.offers
  for insert with check (
    auth.uid() = buyer_id
    and buyer_id != seller_id
  );

-- Обновлять статус может только продавец (accept/reject) или покупатель (counter)
create policy "Продавец обновляет статус оффера" on public.offers
  for update using (
    auth.uid() = seller_id or auth.uid() = buyer_id
  );

-- updated_at триггер
create trigger offers_updated_at
  before update on public.offers
  for each row execute procedure public.set_updated_at();

-- Инкремент inquiries у листинга при создании оффера
create or replace function public.handle_new_offer()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.listings
  set inquiries = inquiries + 1
  where id = new.listing_id;
  return new;
end;
$$;

create trigger on_offer_created
  after insert on public.offers
  for each row execute procedure public.handle_new_offer();
