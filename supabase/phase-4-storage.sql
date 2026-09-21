-- Phase 4: move file payloads out of Postgres into Supabase Storage.
--
-- Until now images and documents were read as base64 data URLs and stored
-- inline in table columns, which bloated every row and pushed the tables toward
-- their size limits. Files now live in Storage buckets; the tables keep only a
-- URL (public buckets) or an object path (private buckets).
--
-- Safe to re-run.

-- ── Buckets ───────────────────────────────────────────────────────────────────
-- public-media      news / activity / achiever / hall-of-fame images (public read)
-- documents         school documents offered for download      (public read)
-- student-documents per-student reports                        (private)
-- application-files documents attached to admissions           (private)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('public-media', 'public-media', true, 10485760,
   array['image/jpeg','image/png','image/webp','image/gif']),
  ('documents', 'documents', true, 20971520,
   array['application/pdf','application/msword',
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
         'application/vnd.ms-excel',
         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
         'text/plain','image/jpeg','image/png']),
  ('student-documents', 'student-documents', false, 20971520,
   array['application/pdf','image/jpeg','image/png',
         'application/msword',
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('application-files', 'application-files', false, 20971520,
   array['application/pdf','image/jpeg','image/png',
         'application/msword',
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ── Policies ──────────────────────────────────────────────────────────────────
-- storage.objects already has RLS enabled; these policies scope access per
-- bucket. The role helpers come from phase-3-rbac.sql.

-- Public buckets: anyone may read, only content editors may write.
drop policy if exists "public media read" on storage.objects;
create policy "public media read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('public-media', 'documents'));

drop policy if exists "staff write public buckets" on storage.objects;
create policy "staff write public buckets"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('public-media', 'documents') and public.can_write_content());

drop policy if exists "staff update public buckets" on storage.objects;
create policy "staff update public buckets"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('public-media', 'documents') and public.can_write_content())
  with check (bucket_id in ('public-media', 'documents') and public.can_write_content());

drop policy if exists "staff delete public buckets" on storage.objects;
create policy "staff delete public buckets"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('public-media', 'documents') and public.can_write_content());

-- Applicant uploads: an anonymous visitor submitting the admissions form may
-- upload, but may not read, overwrite or delete anything. Reads are limited to
-- staff who can see applications, via signed URLs.
drop policy if exists "applicant upload files" on storage.objects;
create policy "applicant upload files"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'application-files');

drop policy if exists "staff read application files" on storage.objects;
create policy "staff read application files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'application-files' and public.can_view_applications());

drop policy if exists "staff delete application files" on storage.objects;
create policy "staff delete application files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'application-files' and public.can_view_applications());

-- Student documents: fully private, staff with the student-docs role only.
drop policy if exists "staff manage student document files" on storage.objects;
create policy "staff manage student document files"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'student-documents' and public.can_manage_student_docs())
  with check (bucket_id = 'student-documents' and public.can_manage_student_docs());

-- ── Documents table: store a URL, not the bytes ───────────────────────────────
-- Existing rows hold base64 in file_data. Rather than migrate megabytes through
-- SQL, add a file_url column and leave file_data defaulting to ''. Rows created
-- before this migration keep working through the public download page only if
-- they were re-uploaded; anything still carrying base64 renders as-is until it
-- is replaced.

alter table public.documents add column if not exists file_url text not null default '';
