-- Jojo SSS — Supabase authentication setup (Phase 1)
--
-- Run this in the Supabase SQL editor after creating the project.
-- Phases 2-4 add the content tables, Row Level Security policies and the
-- storage buckets; this file only covers staff authentication.

-- ── Staff profile table ───────────────────────────────────────────────────────
-- Mirrors the role information the staff portal needs. Rows are created by the
-- staff onboarding script / admin console, keyed to auth.users.
create table if not exists public.staff_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  name text not null,
  role text not null default 'Staff',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.staff_profiles enable row level security;

-- A signed-in staff member may read their own profile row. Principals and
-- administrators may read every row (used by the admin console).
drop policy if exists "staff read own profile" on public.staff_profiles;
create policy "staff read own profile"
  on public.staff_profiles for select
  to authenticated
  using (
    id = auth.uid()
    or exists (
      select 1 from public.staff_profiles me
      where me.id = auth.uid() and me.role in ('Principal', 'Administrator')
    )
  );

-- ── Creating staff accounts ───────────────────────────────────────────────────
-- Staff log in with a short username. The portal maps it to an internal email
-- (username@staff.jojosss.local) before calling Supabase Auth, so each account
-- must be created with that address. Create accounts from the Supabase dashboard
-- (Authentication -> Users -> Add user) or with the admin API, then insert the
-- matching staff_profiles row.
--
-- Suggested accounts:
--   principal           Principal
--   curriculum-deputy   Deputy Principal
--   finance-deputy      Deputy Principal
--   admin               Administrator
--   sciences-maths      HOD
--
-- Example (replace the uuid with the auth user's id):
-- insert into public.staff_profiles (id, username, name, role)
-- values ('00000000-0000-0000-0000-000000000000', 'principal', 'Principal', 'Principal');

-- Note: role-based access control on the admin routes is Phase 3. Until then the
-- portal only distinguishes "signed in" from "not signed in" and the `role`
-- column above is display-only.