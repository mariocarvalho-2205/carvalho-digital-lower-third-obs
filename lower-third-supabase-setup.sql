-- Lower Third OBS - Supabase Setup
create extension if not exists "pgcrypto";

create table if not exists public.overlays (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  is_active boolean not null default false,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.overlays drop constraint if exists overlays_slug_format;
alter table public.overlays add constraint overlays_slug_format
check (slug ~ '^[a-z0-9_-]+$');

create or replace function public.handle_updated_at()
returns trigger language plpgsql security invoker set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists set_overlays_updated_at on public.overlays;
create trigger set_overlays_updated_at
before update on public.overlays
for each row execute function public.handle_updated_at();

alter table public.overlays enable row level security;

drop policy if exists "Public can view overlays" on public.overlays;
drop policy if exists "Authenticated users can create overlays" on public.overlays;
drop policy if exists "Authenticated users can update overlays" on public.overlays;
drop policy if exists "Authenticated users can delete overlays" on public.overlays;
drop policy if exists "Anyone can create overlays" on public.overlays;
drop policy if exists "Anyone can update overlays" on public.overlays;
drop policy if exists "Anyone can delete overlays" on public.overlays;

create policy "Public can view overlays" on public.overlays
for select to anon, authenticated using (true);

create policy "Anyone can create overlays" on public.overlays
for insert to anon, authenticated with check (true);

create policy "Anyone can update overlays" on public.overlays
for update to anon, authenticated using (true) with check (true);

create policy "Anyone can delete overlays" on public.overlays
for delete to anon, authenticated using (true);

do $$
begin
  alter publication supabase_realtime add table public.overlays;
exception when duplicate_object then null;
end $$;

insert into storage.buckets (id, name, public)
values ('overlay-assets', 'overlay-assets', true)
on conflict (id) do nothing;

drop policy if exists "Public can view overlay assets" on storage.objects;
drop policy if exists "Authenticated users can upload overlay assets" on storage.objects;
drop policy if exists "Authenticated users can update overlay assets" on storage.objects;
drop policy if exists "Authenticated users can delete overlay assets" on storage.objects;
drop policy if exists "Anyone can view overlay assets" on storage.objects;
drop policy if exists "Anyone can upload overlay assets" on storage.objects;
drop policy if exists "Anyone can update overlay assets" on storage.objects;
drop policy if exists "Anyone can delete overlay assets" on storage.objects;

create policy "Anyone can view overlay assets" on storage.objects
for select to anon, authenticated, public using (bucket_id = 'overlay-assets');

create policy "Anyone can upload overlay assets" on storage.objects
for insert to anon, authenticated, public with check (bucket_id = 'overlay-assets');

create policy "Anyone can update overlay assets" on storage.objects
for update to anon, authenticated, public using (bucket_id = 'overlay-assets')
with check (bucket_id = 'overlay-assets');

create policy "Anyone can delete overlay assets" on storage.objects
for delete to anon, authenticated, public using (bucket_id = 'overlay-assets');

insert into public.overlays (slug, name, is_active, config)
values (
'ba-ao-vivo',
'BA AO VIVO',
false,
'{
  "canvas":{"width":1920,"height":1080},
  "title":{"visible":true,"content":"MÁRIO CARVALHO","x":280,"y":715,"width":850,"height":55,"fontFamily":"Arial","fontSize":42,"fontWeight":700,"color":"#173A7A","textAlign":"left","lineHeight":1.1,"letterSpacing":0,"textTransform":"uppercase","opacity":1},
  "subtitle":{"visible":true,"content":"APRESENTADOR","x":280,"y":770,"width":850,"height":40,"fontFamily":"Arial","fontSize":24,"fontWeight":400,"color":"#333333","textAlign":"left","lineHeight":1.1,"letterSpacing":0,"textTransform":"none","opacity":1},
  "topBar":{"visible":true,"x":220,"y":630,"width":440,"height":58,"rotation":0,"opacity":1,"background":{"type":"gradient","color":"#1678D3","startColor":"#1678D3","endColor":"#315CC5","direction":"right"},"radius":{"topLeft":25,"topRight":25,"bottomRight":0,"bottomLeft":0},"border":{"enabled":false,"width":0,"color":"#FFFFFF"}},
  "contentBox":{"visible":true,"x":220,"y":688,"width":1100,"height":138,"rotation":0,"opacity":1,"background":{"type":"solid","color":"#FFFFFF"},"radius":{"topLeft":0,"topRight":0,"bottomRight":0,"bottomLeft":0}},
  "bottomBar":{"visible":true,"x":220,"y":826,"width":1200,"height":48,"rotation":0,"opacity":1,"background":{"type":"gradient","color":"#1678D3","startColor":"#1678D3","endColor":"#6200D8","direction":"right"},"radius":{"topLeft":0,"topRight":0,"bottomRight":0,"bottomLeft":0},"border":{"enabled":false,"width":0,"color":"#FFFFFF"}},
  "logo":{"visible":true,"url":null,"x":1180,"y":670,"width":150,"height":150,"objectFit":"contain","padding":10,"opacity":1,"backgroundType":"circle","backgroundColor":"#FFFFFF","radius":{"topLeft":75,"topRight":75,"bottomRight":75,"bottomLeft":75}},
  "animation":{"enabled":true,"enter":{"type":"slide-left","duration":500,"delay":0},"exit":{"type":"fade","duration":300,"delay":0}}
}'::jsonb
)
on conflict (slug) do nothing;

select id, slug, name, is_active, created_at, updated_at
from public.overlays
order by created_at desc;
