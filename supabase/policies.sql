-- =========================================================
-- VLDD NOTES HUB / VETEDUCATION — ROW LEVEL SECURITY POLICIES
-- =========================================================

-- Helper function to check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 1. Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.batches enable row level security;
alter table public.notes enable row level security;
alter table public.unlocks enable row level security;
alter table public.payment_requests enable row level security;
alter table public.settings enable row level security;
alter table public.download_log enable row level security;

-- 2. Profiles Policies
drop policy if exists "Profiles: select own or admin" on public.profiles;
create policy "Profiles: select own or admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Profiles: update own or admin" on public.profiles;
create policy "Profiles: update own or admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

-- 3. Batches Policies
drop policy if exists "Batches: authenticated read active" on public.batches;
create policy "Batches: authenticated read active"
  on public.batches for select
  using ((auth.role() = 'authenticated' and is_active = true) or public.is_admin());

drop policy if exists "Batches: admin full access" on public.batches;
create policy "Batches: admin full access"
  on public.batches for all
  using (public.is_admin());

-- 4. Notes Policies
drop policy if exists "Notes: authenticated read published" on public.notes;
create policy "Notes: authenticated read published"
  on public.notes for select
  using ((auth.role() = 'authenticated' and is_published = true) or public.is_admin());

drop policy if exists "Notes: admin write access" on public.notes;
create policy "Notes: admin write access"
  on public.notes for all
  using (public.is_admin());

-- 5. Unlocks Policies (Client insert denied, server-side only via service role)
drop policy if exists "Unlocks: select own or admin" on public.unlocks;
create policy "Unlocks: select own or admin"
  on public.unlocks for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Unlocks: admin write" on public.unlocks;
create policy "Unlocks: admin write"
  on public.unlocks for all
  using (public.is_admin());

-- 6. Payment Requests Policies
drop policy if exists "Payment Requests: select own or admin" on public.payment_requests;
create policy "Payment Requests: select own or admin"
  on public.payment_requests for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Payment Requests: insert own" on public.payment_requests;
create policy "Payment Requests: insert own"
  on public.payment_requests for insert
  with check (auth.uid() = user_id);

drop policy if exists "Payment Requests: admin update" on public.payment_requests;
create policy "Payment Requests: admin update"
  on public.payment_requests for update
  using (public.is_admin());

-- 7. Settings Policies
drop policy if exists "Settings: authenticated read public keys" on public.settings;
create policy "Settings: authenticated read public keys"
  on public.settings for select
  using (
    auth.role() = 'authenticated'
    and key in ('upi_id', 'whatsapp_number', 'site_notice', 'site_notice_active')
    or public.is_admin()
  );

drop policy if exists "Settings: admin write" on public.settings;
create policy "Settings: admin write"
  on public.settings for all
  using (public.is_admin());

-- 8. Download Log Policies (Server-side service role inserts, admin reads)
drop policy if exists "Download Log: admin read" on public.download_log;
create policy "Download Log: admin read"
  on public.download_log for select
  using (public.is_admin());

-- 9. Storage Bucket Policies for 'notes' (Private bucket)
-- Ensure bucket exists and is private
insert into storage.buckets (id, name, public)
values ('notes', 'notes', false)
on conflict (id) do update set public = false;

-- Disallow public access to storage.objects for 'notes' bucket
-- Storage objects are accessed strictly via Server Route Handlers using service role
