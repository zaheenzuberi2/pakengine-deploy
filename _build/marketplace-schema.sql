-- PakEngine Marketplace schema — run once against the pakengine-marketplace Supabase project.
-- Mirrors the anon/authenticated RLS split already proven in alpha-creations-website/supabase-setup.sql.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  phone text not null,
  city text,
  seller_type text not null default 'individual' check (seller_type in ('individual','showroom')),
  showroom_id text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  listing_type text not null check (listing_type in ('sale','rent')),
  make text not null,
  model text not null,
  year int,
  price numeric not null,
  price_unit text not null default 'total' check (price_unit in ('total','per_day')),
  city text not null,
  description text,
  whatsapp_number text not null,
  status text not null default 'pending' check (status in ('pending','active','sold','rented','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.listing_photos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  storage_path text not null,
  sort_order int not null default 0
);

-- Auto-create a profile row when someone signs up (Supabase Auth trigger pattern).
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''), coalesce(new.raw_user_meta_data->>'phone', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper used by RLS policies to check admin status without recursive RLS issues.
create function public.is_admin(uid uuid)
returns boolean as $$
  select coalesce((select is_admin from public.profiles where id = uid), false);
$$ language sql security definer stable;

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_photos enable row level security;

-- profiles: users manage only their own row; admin can read all.
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_select_admin" on public.profiles for select using (public.is_admin(auth.uid()));
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- listings: public sees only active; owners manage their own; admin sees/updates everything (moderation).
create policy "listings_select_public" on public.listings for select using (status = 'active');
create policy "listings_select_own" on public.listings for select using (auth.uid() = seller_id);
create policy "listings_select_admin" on public.listings for select using (public.is_admin(auth.uid()));
create policy "listings_insert_own" on public.listings for insert with check (auth.uid() = seller_id);
create policy "listings_update_own" on public.listings for update using (auth.uid() = seller_id);
create policy "listings_update_admin" on public.listings for update using (public.is_admin(auth.uid()));
create policy "listings_delete_own" on public.listings for delete using (auth.uid() = seller_id);

-- listing_photos: readable if the parent listing is public, own, or admin; writable only by the listing's owner.
create policy "photos_select" on public.listing_photos for select using (
  exists (
    select 1 from public.listings l
    where l.id = listing_photos.listing_id
      and (l.status = 'active' or l.seller_id = auth.uid() or public.is_admin(auth.uid()))
  )
);
create policy "photos_insert_own" on public.listing_photos for insert with check (
  exists (select 1 from public.listings l where l.id = listing_photos.listing_id and l.seller_id = auth.uid())
);
create policy "photos_delete_own" on public.listing_photos for delete using (
  exists (select 1 from public.listings l where l.id = listing_photos.listing_id and l.seller_id = auth.uid())
);

-- Storage bucket for listing photos (public read, authenticated write into their own path).
insert into storage.buckets (id, name, public) values ('marketplace-photos', 'marketplace-photos', true);

create policy "marketplace_photos_read" on storage.objects for select using (bucket_id = 'marketplace-photos');
create policy "marketplace_photos_insert" on storage.objects for insert with check (
  bucket_id = 'marketplace-photos' and auth.role() = 'authenticated'
);
create policy "marketplace_photos_delete_own" on storage.objects for delete using (
  bucket_id = 'marketplace-photos' and owner = auth.uid()
);
