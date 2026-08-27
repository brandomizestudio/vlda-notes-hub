-- =========================================================
-- VLDD NOTES HUB / VETEDUCATION — DATABASE SCHEMA
-- =========================================================

-- Enable uuid-ossp if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (phone-as-identity mapped to synthetic email)
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  name        text not null,
  phone       text not null unique,
  role        text not null default 'student' check (role in ('student','admin')),
  created_at  timestamptz not null default now()
);

-- 2. Batches Table ('entrance' | 'year')
create table if not exists public.batches (
  id          text primary key,
  title       text not null,
  subtitle    text not null,
  sort_order  int  not null default 0,
  is_active   boolean not null default true
);

-- 3. Notes Table
create table if not exists public.notes (
  id            uuid primary key default gen_random_uuid(),
  batch_id      text not null references public.batches(id) on delete cascade,
  tier          text not null check (tier in ('free','paid')),
  title         text not null,
  description   text,
  subject       text,
  language      text not null default 'Hindi',
  pages         int  not null default 1,
  file_path     text not null,                 -- storage key inside private bucket 'notes'
  file_size     bigint not null default 0,     -- bytes
  price_paise   int  not null default 0,       -- store money in paise, never floats
  pdf_password  text,                          -- null for free notes
  sort_order    int  not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now()
);

-- 4. Unlocks Table
-- note_id is text (not FK) so it can store the special BUNDLE_ID
-- as well as individual note UUIDs.
create table if not exists public.unlocks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  note_id     text not null,   -- UUID string; may be BUNDLE_ID or a real note id
  created_at  timestamptz not null default now(),
  unique (user_id, note_id)
);

-- 5. Payment Requests Table
-- note_id is text (same reason as above)
create table if not exists public.payment_requests (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  note_id      text not null,  -- UUID string; may be BUNDLE_ID
  utr          text not null,
  amount_paise int not null,
  status       text not null default 'pending' check (status in ('pending','approved','rejected')),
  admin_note   text,
  created_at   timestamptz not null default now(),
  decided_at   timestamptz
);

-- 6. Settings Table
create table if not exists public.settings (
  key   text primary key,
  value text not null
);

-- 7. Download Log Table
create table if not exists public.download_log (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  note_id     uuid not null references public.notes(id) on delete cascade,
  ip          text,
  created_at  timestamptz not null default now()
);

-- 8. Indexes
create index if not exists idx_notes_batch_tier_order on public.notes (batch_id, tier, sort_order);
create index if not exists idx_unlocks_user_id on public.unlocks (user_id);
create index if not exists idx_payment_requests_status_created on public.payment_requests (status, created_at desc);

-- 9. Public View for Notes (Never expose pdf_password and file_path to clients)
create or replace view public.notes_public as
select
  id,
  batch_id,
  tier,
  title,
  description,
  subject,
  language,
  pages,
  file_size,
  price_paise,
  sort_order,
  is_published,
  created_at
from public.notes
where is_published = true;

-- 10. Auth trigger to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Student'),
    coalesce(new.raw_user_meta_data->>'phone', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  )
  on conflict (id) do update
  set
    name = coalesce(excluded.name, profiles.name),
    phone = coalesce(excluded.phone, profiles.phone);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 11. Default Settings (upsert so re-running is safe)
insert into public.settings (key, value) values
  ('upi_id',             'vlddnotes@upi'),
  ('whatsapp_number',    '919857041222'),
  ('site_notice',        'Naye batch ke notes upload ho rahe hain!'),
  ('site_notice_active', 'true'),
  ('bundle_password',    'VLDD99')
on conflict (key) do nothing;

-- 12. Seed Batches (upsert so re-running is safe)
insert into public.batches (id, title, subtitle, sort_order, is_active) values
  ('entrance', 'VLDD Entrance Exam', 'Physics, Chemistry, Biology aur General Aptitude ke syllabus-aligned complete notes.', 1, true),
  ('year',     'VLDD 1st & 2nd Year', 'Diploma subjects ke topic-wise handwritten aur clear diagrams waale complete notes.', 2, true)
on conflict (id) do nothing;

-- =========================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

-- Enable RLS on all tables
alter table public.profiles          enable row level security;
alter table public.batches           enable row level security;
alter table public.notes             enable row level security;
alter table public.unlocks           enable row level security;
alter table public.payment_requests  enable row level security;
alter table public.settings          enable row level security;
alter table public.download_log      enable row level security;

-- ── profiles ─────────────────────────────────────────────
-- Users can read and update their own profile
create policy "profiles: own read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: own update" on public.profiles for update using (auth.uid() = id);
create policy "profiles: insert own" on public.profiles for insert with check (auth.uid() = id);
-- Admins can read all profiles
create policy "profiles: admin read all" on public.profiles for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ── batches ──────────────────────────────────────────────
-- Public read for active batches (even without login — for landing page)
create policy "batches: public read" on public.batches for select using (is_active = true);
-- Admin full access
create policy "batches: admin all" on public.batches for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ── notes ────────────────────────────────────────────────
-- Authenticated users can read published notes (via server with service_role for file_path)
-- Server uses service_role key so this policy applies to anon client only
create policy "notes: auth read published" on public.notes for select
  using (is_published = true and auth.role() = 'authenticated');
-- Admin full access
create policy "notes: admin all" on public.notes for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ── notes_public view ─────────────────────────────────────
-- The view inherits from notes table — no separate RLS needed

-- ── unlocks ──────────────────────────────────────────────
create policy "unlocks: own read"   on public.unlocks for select using (auth.uid() = user_id);
create policy "unlocks: own insert" on public.unlocks for insert with check (auth.uid() = user_id);
-- Admin read all
create policy "unlocks: admin all" on public.unlocks for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ── payment_requests ─────────────────────────────────────
create policy "payment_requests: own read"   on public.payment_requests for select using (auth.uid() = user_id);
create policy "payment_requests: own insert" on public.payment_requests for insert with check (auth.uid() = user_id);
-- Admin full access
create policy "payment_requests: admin all" on public.payment_requests for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ── settings ─────────────────────────────────────────────
-- Authenticated users can read settings (UPI ID, WhatsApp number etc.)
create policy "settings: auth read" on public.settings for select using (auth.role() = 'authenticated');
-- Admin can write
create policy "settings: admin write" on public.settings for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ── download_log ─────────────────────────────────────────
create policy "download_log: own insert" on public.download_log for insert with check (auth.uid() = user_id);
create policy "download_log: admin read" on public.download_log for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

