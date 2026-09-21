-- Phase 3: role-based access control.
--
-- Phase 1 created public.staff_profiles with columns (id, username, name, role).
-- That table is the right home for roles, but until now `role` was display-only
-- and the portal only distinguished "signed in" from "not signed in". This
-- migration makes the column authoritative and teaches the RLS policies to read
-- it, so the database — not the browser — decides who may write what.
--
-- Safe to re-run.

-- ── Normalise roles ───────────────────────────────────────────────────────────
-- Phase 1 defaulted to 'Staff'. 'Unassigned' is the explicit "no role granted
-- yet" state the portal checks for, so fold the old default into it.

alter table public.staff_profiles alter column role set default 'Unassigned';

update public.staff_profiles
set role = 'Unassigned'
where role is null or role = 'Staff';

-- ── Role helpers ────────────────────────────────────────────────────────────
-- SECURITY DEFINER so policies on staff_profiles itself can consult the table
-- without recursing through its own RLS.

create or replace function public.current_staff_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role from public.staff_profiles where id = auth.uid()),
    'Unassigned'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.staff_profiles where id = auth.uid());
$$;

-- Roles allowed to edit public website content.
create or replace function public.can_write_content()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_staff_role() in ('Principal','Deputy Principal','Administrator','HOD');
$$;

-- Roles allowed to read learner applications.
create or replace function public.can_view_applications()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_staff_role() in ('Principal','Deputy Principal','Administrator','HOD');
$$;

-- Roles allowed to read/write per-student documents.
create or replace function public.can_manage_student_docs()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_staff_role() in ('Principal','Deputy Principal','Administrator');
$$;

-- Roles allowed to change other staff members' roles.
create or replace function public.is_staff_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_staff_role() in ('Principal','Administrator');
$$;

revoke all on function public.current_staff_role() from public;
revoke all on function public.is_staff() from public;
revoke all on function public.can_write_content() from public;
revoke all on function public.can_view_applications() from public;
revoke all on function public.can_manage_student_docs() from public;
revoke all on function public.is_staff_admin() from public;

grant execute on function public.current_staff_role() to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.can_write_content() to authenticated;
grant execute on function public.can_view_applications() to authenticated;
grant execute on function public.can_manage_student_docs() to authenticated;
grant execute on function public.is_staff_admin() to authenticated;

-- ── Keep profiles in step with accounts ───────────────────────────────────────
-- New auth users get a profile automatically, so an account can never exist
-- without a row (and therefore without a role) to authorize it.

create or replace function public.handle_new_staff()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.staff_profiles (id, username, name, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'username', ''), new.id::text),
    coalesce(nullif(new.raw_user_meta_data->>'name', ''), split_part(new.email, '@', 1)),
    'Unassigned'
  )
  on conflict (id) do nothing;
  return new;
exception when unique_violation then
  -- A profile with the same username already exists; leave it untouched.
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_staff();

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table public.staff_profiles enable row level security;

-- Every signed-in staff member may read the staff list: the portal shows names
-- and roles, and the Staff page renders the whole roster. This replaces the
-- Phase 1 policy, which limited each staff member to their own row.
drop policy if exists "staff read own profile" on public.staff_profiles;
drop policy if exists "staff read profiles" on public.staff_profiles;
create policy "staff read profiles"
  on public.staff_profiles for select
  to authenticated
  using (public.is_staff());

-- Role changes are limited to Principal/Administrator. There is deliberately no
-- INSERT policy: profiles are created by the auth trigger, which runs as
-- definer, so nobody can invent a profile for themselves.
drop policy if exists "admins manage profiles" on public.staff_profiles;
create policy "admins manage profiles"
  on public.staff_profiles for update
  to authenticated
  using (public.is_staff_admin())
  with check (public.is_staff_admin());

-- ── Tighten the content policies from Phase 2 ─────────────────────────────────
-- Phase 2 allowed any authenticated account to write every content table. That
-- assumed the only authenticated accounts are staff; it is safer to gate writes
-- on an explicit role.

do $$
declare
  t text;
begin
  foreach t in array array[
    'news','about','contact','activities','achievers','hall_of_fame',
    'results_by_year','documents'
  ]
  loop
    execute format('drop policy if exists "staff write" on public.%I', t);
    execute format(
      'create policy "staff write" on public.%I for all
       to authenticated
       using (public.can_write_content())
       with check (public.can_write_content())', t);
  end loop;
end;
$$;

drop policy if exists "staff manage applications" on public.applications;
create policy "staff manage applications"
  on public.applications for all
  to authenticated
  using (public.can_view_applications())
  with check (public.can_view_applications());

drop policy if exists "staff manage student documents" on public.student_documents;
create policy "staff manage student documents"
  on public.student_documents for all
  to authenticated
  using (public.can_manage_student_docs())
  with check (public.can_manage_student_docs());

-- ── Granting the first role ───────────────────────────────────────────────────
-- A brand-new install has no Principal, and only a Principal/Administrator can
-- assign roles. Bootstrap the first one from the SQL editor (which runs with
-- elevated rights and bypasses RLS):
--
--   update public.staff_profiles set role = 'Principal'
--   where username = 'principal';
--
-- Suggested roles: principal (Principal), curriculum-deputy and finance-deputy
-- (Deputy Principal), admin (Administrator), sciences-maths (HOD).
