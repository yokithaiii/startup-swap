-- Создаём bucket если не существует
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

-- Политики для storage
-- Читать могут все (bucket публичный)
create policy "Публичное чтение listing-images"
  on storage.objects for select
  using (bucket_id = 'listing-images');

-- Загружать могут только авторизованные
create policy "Авторизованные загружают listing-images"
  on storage.objects for insert
  with check (
    bucket_id = 'listing-images'
    and auth.role() = 'authenticated'
  );

-- Удалять может только владелец файла
create policy "Владелец удаляет listing-images"
  on storage.objects for delete
  using (
    bucket_id = 'listing-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
