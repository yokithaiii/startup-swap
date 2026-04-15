-- Исправляем триггер: GitHub присылает full_name, а не first_name/last_name
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  _first_name text;
  _last_name  text;
  _avatar_url text;
  _full_name  text;
begin
  _full_name  := new.raw_user_meta_data ->> 'full_name';
  _first_name := new.raw_user_meta_data ->> 'first_name';
  _last_name  := new.raw_user_meta_data ->> 'last_name';
  _avatar_url := coalesce(
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'picture'
  );

  -- Если first_name пустой но есть full_name — разбиваем
  if _first_name is null and _full_name is not null then
    _first_name := split_part(_full_name, ' ', 1);
    _last_name  := nullif(trim(substring(_full_name from position(' ' in _full_name))), '');
  end if;

  insert into public.profiles (id, email, first_name, last_name, avatar_url)
  values (new.id, new.email, _first_name, _last_name, _avatar_url);

  return new;
end;
$$;

-- Заполняем уже существующих пользователей у которых first_name = null
update public.profiles p
set
  first_name = split_part(coalesce(u.raw_user_meta_data ->> 'full_name', ''), ' ', 1),
  last_name  = nullif(trim(substring(coalesce(u.raw_user_meta_data ->> 'full_name', '') from position(' ' in coalesce(u.raw_user_meta_data ->> 'full_name', '')))), ''),
  avatar_url = coalesce(
    u.raw_user_meta_data ->> 'avatar_url',
    u.raw_user_meta_data ->> 'picture',
    p.avatar_url
  )
from auth.users u
where u.id = p.id
  and p.first_name is null;
