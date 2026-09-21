-- Jojo SSS — content schema, Row Level Security and student numbering (Phase 2)
--
-- Run after supabase/phase-1-auth.sql.
--
-- Design notes
--   * Simple scalar entities get real columns; deeply nested form payloads
--     (an application, the about page) are stored as jsonb to avoid a schema
--     per field while keeping the TypeScript interfaces in storage.ts the source
--     of truth.
--   * The public website must read news/about/contact/activities/achievements/
--     results/documents WITHOUT signing in, so those tables allow anonymous
--     SELECT. Only authenticated staff may write.
--   * applications allows anonymous INSERT (the public admissions form) but
--     SELECT/UPDATE/DELETE are staff-only. Admission uploads no longer land in
--     another user's browser storage.
--   * student_documents is staff-only for now; per-student read access arrives
--     in Phase 5.

-- ── Tables ────────────────────────────────────────────────────────────────────

create table if not exists public.news (
  id text primary key,
  title text not null,
  content text not null default '',
  image text not null default '',
  date text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.about (
  id text primary key default 'about',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.contact (
  id text primary key default 'contact',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id text primary key,
  name text not null,
  description text not null default '',
  category text not null default '',
  image text not null default '',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.achievers (
  id text primary key,
  year text not null,
  name text not null,
  achievement text not null default '',
  image text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.hall_of_fame (
  id text primary key,
  name text not null,
  title text not null default '',
  year text not null default '',
  description text not null default '',
  image text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.results_by_year (
  year text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id text primary key,
  name text not null,
  grade text not null default '',
  subject text not null default '',
  file_data text not null default '',
  file_name text not null default '',
  upload_date text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id text primary key,
  student_number text not null default '',
  first_name text not null default '',
  last_name text not null default '',
  grade text not null default '',
  status text not null default 'Pending',
  submitted_date text not null default '',
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_documents (
  id text primary key,
  student_number text not null,
  title text not null,
  category text not null default 'Report',
  year text not null default '',
  term text not null default '',
  file_name text not null default '',
  file_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists student_documents_student_number_idx
  on public.student_documents (student_number);
create index if not exists applications_status_idx on public.applications (status);
create index if not exists achievers_year_idx on public.achievers (year);

-- ── updated_at maintenance ────────────────────────────────────────────────────

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'news','about','contact','activities','achievers','hall_of_fame',
    'results_by_year','documents','applications','student_documents'
  ]
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.touch_updated_at()', t);
  end loop;
end;
$$;

-- ── Student number allocation ─────────────────────────────────────────────────
-- Replaces the localStorage counter, which gave every browser its own sequence
-- and therefore duplicate student numbers.

create sequence if not exists public.student_number_seq;

create or replace function public.next_student_number(p_year text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  n bigint;
begin
  n := nextval('public.student_number_seq');
  return p_year || '-' || lpad(n::text, 6, '0');
end;
$$;

-- Allocating numbers is not exposed to anonymous visitors: it would let anyone
-- burn the public sequence or fingerprint application volume. Only the atomic
-- submit function below calls it.
revoke all on function public.next_student_number(text) from public;
revoke all on function public.next_student_number(text) from anon;
grant execute on function public.next_student_number(text) to authenticated;

-- ── Atomic application submit ─────────────────────────────────────────────────
-- The public admissions form inserts through this function so the student
-- number is allocated and the row written in one transaction. Anonymous users
-- have no direct INSERT/SELECT access to the applications table.
create or replace function public.submit_application(p_data jsonb)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_number text;
begin
  if p_data is null or jsonb_typeof(p_data) <> 'object' then
    raise exception 'application payload must be a JSON object';
  end if;

  v_number := public.next_student_number(coalesce(p_data->>'year', ''));

  insert into public.applications (
    id, student_number, first_name, last_name, grade, status, submitted_date, data
  ) values (
    coalesce(nullif(p_data->>'id', ''), gen_random_uuid()::text),
    v_number,
    coalesce(p_data->>'firstName', ''),
    coalesce(p_data->>'lastName', ''),
    coalesce(p_data->>'grade', ''),
    'Pending',
    coalesce(nullif(p_data->>'submittedDate', ''), to_char(now(), 'YYYY-MM-DD')),
    p_data
  );

  return v_number;
end;
$$;

revoke all on function public.submit_application(jsonb) from public;
grant execute on function public.submit_application(jsonb) to anon, authenticated;

-- ── Application status lookup ─────────────────────────────────────────────────
-- The public chatbot lets an applicant check their own status. Anonymous users
-- cannot read the applications table (see RLS below), so expose a narrow
-- security-definer function instead: it requires an exact student number, or an
-- exact name + date of birth, and returns only status fields — never the full
-- application or the uploaded documents.

create or replace function public.application_status(
  p_student_number text default null,
  p_first_name text default null,
  p_last_name text default null,
  p_dob text default null
)
returns table (
  student_number text,
  first_name text,
  last_name text,
  grade text,
  status text,
  submitted_date text
)
language sql
security definer
set search_path = public
as $$
  select a.student_number, a.first_name, a.last_name, a.grade, a.status, a.submitted_date
  from public.applications a
  where (
      p_student_number is not null
      and upper(a.student_number) = upper(p_student_number)
    )
    or (
      p_student_number is null
      and p_first_name is not null and p_last_name is not null and p_dob is not null
      and lower(a.first_name) = lower(p_first_name)
      and lower(a.last_name) = lower(p_last_name)
      and a.data->>'dob' = p_dob
    )
  limit 1;
$$;

revoke all on function public.application_status(text, text, text, text) from public;
grant execute on function public.application_status(text, text, text, text) to anon, authenticated;

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table public.news               enable row level security;
alter table public.about              enable row level security;
alter table public.contact            enable row level security;
alter table public.activities         enable row level security;
alter table public.achievers          enable row level security;
alter table public.hall_of_fame       enable row level security;
alter table public.results_by_year    enable row level security;
alter table public.documents          enable row level security;
alter table public.applications       enable row level security;
alter table public.student_documents  enable row level security;

-- Publicly readable content: anyone may SELECT, only staff may write.
do $$
declare
  t text;
begin
  foreach t in array array[
    'news','about','contact','activities','achievers','hall_of_fame',
    'results_by_year','documents'
  ]
  loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format(
      'create policy "public read" on public.%I for select
       to anon, authenticated using (true)', t);

    execute format('drop policy if exists "staff write" on public.%I', t);
    execute format(
      'create policy "staff write" on public.%I for all
       to authenticated using (true) with check (true)', t);
  end loop;
end;
$$;

-- Applications: staff-only read/write. The public form writes through the
-- submit_application() function, which runs as definer and validates input.
drop policy if exists "public submit application" on public.applications;

drop policy if exists "staff manage applications" on public.applications;
create policy "staff manage applications"
  on public.applications for all
  to authenticated
  using (true) with check (true);

-- Student documents: staff only until Phase 5 adds per-student access.
drop policy if exists "staff manage student documents" on public.student_documents;
create policy "staff manage student documents"
  on public.student_documents for all
  to authenticated
  using (true) with check (true);

-- ── Seed the current defaults ─────────────────────────────────────────────────
-- These were previously hard-coded fallbacks in storage.ts. Seeding them here
-- means every visitor sees the same content instead of per-browser defaults.

insert into public.about (id, data) values ('about', $json$
{
  "historyParagraphs": [
    "Jojo Senior Secondary School is a public no-fee school located in the Dundee Area of Mount Ayliff, Eastern Cape. The school falls under the Alfred Nzo West Education District and serves the local community with dedication and pride.",
    "Guided by the motto \"The Sky Is The Limit\", Jojo SSS is committed to excellence in teaching and learning, building strong working relationships among teachers, parents and learners, and providing a welcoming atmosphere to all stakeholders.",
    "The school offers Grades 8 to 12 with three streams per grade (A, B and C). With 48 educators, Jojo SSS provides a comprehensive curriculum including Science, Business/Commerce and Humanities streams in the FET phase."
  ],
  "principalName": "Mr W.T. Mnganyana",
  "principalTitle": "Principal",
  "principalMessage": [
    "Welcome to Jojo Senior Secondary School. We are committed to excellence in everything we do so that our learners become responsible citizens.",
    "We strive to create an environment that is conducive for teaching and learning, to build good working relations between teachers, parents and learners, and to provide a welcoming atmosphere to all stakeholders visiting the school.",
    "Together we reach for the sky."
  ]
}
$json$::jsonb)
on conflict (id) do nothing;

insert into public.contact (id, data) values ('contact', $json$
{
  "address": "Dundee Area, Mount Ayliff, Eastern Cape 4735\nP.O. Box 58, Mount Ayliff, 4735",
  "phone": "039 940 4284 / 072 349 3647",
  "email": "jojos.s.school@gmail.com",
  "monThu": "07:30 - 15:30",
  "friday": "07:30 - 15:30",
  "weekend": "Closed"
}
$json$::jsonb)
on conflict (id) do nothing;

insert into public.news (id, title, content, image, date) values
  ('1', '2027 Admissions Open',
   'Applications for Grade 8 admission for the 2027 academic year are now open. Apply online or download the application form from the Admissions page.',
   '', '01 Apr 2026'),
  ('2', 'Term 1 Parents Meeting',
   'Parents and guardians are invited to a Term 1 feedback meeting. Time and venue will be confirmed by the school.',
   '', '15 Apr 2026')
on conflict (id) do nothing;

insert into public.activities (id, name, description, category, image, sort_order) values
  ('1', 'Soccer', 'Training and competition at school and district level.', 'Sport', '', 1),
  ('2', 'Netball', 'Competitive teams across age groups.', 'Sport', '', 2),
  ('3', 'Athletics', 'Track and field development and competition.', 'Sport', '', 3),
  ('4', 'Debating', 'Building critical thinking and communication skills.', 'Academic', '', 4),
  ('5', 'Choir', 'Music and performance for school events and competitions.', 'Culture', '', 5)
on conflict (id) do nothing;

insert into public.hall_of_fame (id, name, title, year, description, image) values
  ('1', 'Mrhwebi Esam', 'Top Achiever', '2025', '', '/assets/achievements/mrhwebi-esam.jpg'),
  ('2', 'Dlungwana Kungawo', 'Top Achiever', '2024', '', '/assets/achievements/dlungwana-kungawo.jpg'),
  ('3', 'Mhloleli Mbali', 'Top Achiever', '2023', '', '/assets/achievements/mhloleli-mbali.jpg'),
  ('4', 'Gwanya Mcoseleli', 'Top Achiever', '2023', '', '/assets/achievements/gwanya-mcoseleli.jpg')
on conflict (id) do nothing;

insert into public.results_by_year (year, data) values
  ('2025', '{"overall":93.7,"bachelor":200,"bachelorRate":70,"distinctions":145,"wrote":285,"subjects":[]}'::jsonb),
  ('2024', '{"overall":96,"bachelor":209,"bachelorRate":68,"distinctions":213,"wrote":308,"subjects":[]}'::jsonb),
  ('2023', '{"overall":91,"bachelor":165,"bachelorRate":62,"distinctions":62,"wrote":266,"subjects":[]}'::jsonb)
on conflict (year) do nothing;