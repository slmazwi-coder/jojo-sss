// Content storage backed by Supabase.
//
// This module is the single source of truth for the public website and the
// staff portal. Reads and writes go to Postgres, so content is shared across
// devices and users instead of living in one browser's localStorage.
//
// Access rules live in supabase/phase-2-content.sql: publicly readable content
// allows anonymous SELECT, while writes require an authenticated staff session.
// File payloads live in Supabase Storage (phase-4-storage.sql) rather than
// inline as base64; see uploadFile/getSignedFileUrl below.

import { supabase } from '../../services/supabase';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  grade: string;
  subject: string;
  /** Public URL of the stored file. Empty for documents created before Phase 4. */
  fileUrl: string;
  fileName: string;
  uploadDate: string;
}

export type UploadedFile = {
  key: string;
  label: string;
  fileName: string;
  mimeType: string;
  /** Object path in the private `application-files` bucket. */
  path: string;
};

export type SubjectMark = {
  subject: string;
  mark: number; // 0-100
};

export type LearnerContact = {
  homeTelephone?: string;
  emergencyTelephone?: string;
  learnerCell?: string;
  learnerEmail?: string;
};

export type LearnerParticulars = {
  initials?: string;
  nickName?: string;
  otherNames?: string;
  identificationNumber?: string; // ID / Passport
  citizenship?: string;
  race?: string;
  homeLanguage?: string;
  preferredLanguageOfInstruction?: string;
  physicalAddress?: string;
  citySuburb?: string;
  postalCode?: string;
  province?: string;
  countryOfResidence?: string;
  isBoarder?: 'Yes' | 'No';
  modeOfTransport?: string;
  deceasedParent?: 'Mother' | 'Father' | 'Both' | 'None';
  religion?: string;
  accessionNo?: string;
  highestGradePassed?: string;
  yearWhenGradeWasPassed?: string;
};

export type PreviousSchoolInfo = {
  name?: string;
  address?: string;
  code?: string;
  province?: string;
  country?: string;
};

export type LearnerMedicalInfo = {
  medicalAidNumber?: string;
  medicalAidName?: string;
  medicalAidMainMember?: string;
  doctorName?: string;
  doctorTelephoneNumber?: string;
  doctorAddress?: string;
  medicalCondition?: string;
  specialProblemsRequiringCounselling?: string;
  dexterity?: 'Right Handed' | 'Left Handed' | 'Ambidextrous';
  socialGrant?: { reg?: 'Yes' | 'No'; rec?: 'Yes' | 'No' };
};

export type SiblingInfo = {
  numberOfOtherChildrenAtSchool?: string;
  positionInFamily?: string;
  siblings?: Array<{ name: string; grade: string; positionInFamily?: string }>;
};

export type ParentGuardian = {
  title?: string;
  initials?: string;
  firstName?: string;
  surname?: string;
  gender?: string;
  race?: string;
  homeLanguage?: string;
  identificationNumber?: string; // ID / Passport
  accountPayer?: 'Yes' | 'No';
  residentialStreetAddress?: string;
  citySuburb?: string;
  code?: string;
  employer?: string;
  occupation?: string;
  surnameOfSpouse?: string;
  occupationOfSpouse?: string;
  spouseIdNumber?: string;
  learnerResidesWithThisParent?: 'Yes' | 'No';
  relationshipToLearner?: string;
  maritalStatusOfParent?: string;
};

export type CorrespondenceDetails = {
  title?: string;
  surname?: string;
  postalAddress?: string;
};

export type OtherContactDetails = {
  homeTelephone?: string;
  faxNumber?: string;
  spouseWorkTelephoneNumber?: string;
  emailAddress?: string;
  workTelephone?: string;
  cellNumber?: string;
  spouseCellNumber?: string;
  spouseEmailAddress?: string;
};

export interface Application {
  id: string;

  // Learner (minimum)
  firstName: string;
  lastName: string;
  dob: string;
  gender?: string;
  grade: string;
  year: string;

  // Generated
  studentNumber: string;

  // Legacy parent/guardian fields (keep for backward compatibility)
  guardianName: string;
  guardianRelationship?: string;
  guardianPhone: string;
  guardianEmail: string;

  // Address (legacy)
  address: string;
  locality: string;

  // School history (legacy)
  previousSchool: string;
  lastGradeCompleted?: string;

  // Notes (legacy)
  medicalInfo?: string;

  // New structured fields
  learner?: LearnerParticulars;
  learnerContact?: LearnerContact;
  previousSchoolInfo?: PreviousSchoolInfo;
  learnerMedicalInfo?: LearnerMedicalInfo;
  siblingInfo?: SiblingInfo;
  parentGuardian1?: ParentGuardian;
  parentGuardian2?: ParentGuardian;
  correspondenceDetails?: CorrespondenceDetails;
  otherContactDetails?: OtherContactDetails;

  applicationType: 'General';

  // Uploads
  uploads: UploadedFile[];

  // Academic report capture (manual entry for now)
  subjectMarks: SubjectMark[];
  averageMark: number;

  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  submittedDate: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  monThu: string;
  friday: string;
  weekend: string;
}

export interface AboutInfo {
  historyParagraphs: string[];
  principalName: string;
  principalTitle: string;
  principalMessage: string[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
}

export interface AchieverEntry {
  id: string;
  name: string;
  achievement: string;
  image: string;
}

export interface HallOfFameEntry {
  id: string;
  name: string;
  title: string;
  year: string;
  desc: string;
  image: string;
}

export interface YearResults {
  overall: number;
  bachelor: number;
  bachelorRate: number;
  distinctions: number;
  wrote: number;
  subjects: { subject: string; rate: number }[];
}

/** Shared error type so callers can surface a consistent message. */
export class StorageError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'StorageError';
  }
}

function fail(action: string, error: { message?: string } | null): never {
  // eslint-disable-next-line no-console
  console.error(`Storage ${action} failed:`, error);
  throw new StorageError(`Could not ${action}. Please check your connection and try again.`, error);
}

/** Rows carry Supabase bookkeeping columns; callers only want the domain shape. */
function stripMeta<T>(row: Record<string, unknown>, drop: string[]): T {
  const copy: Record<string, unknown> = { ...row };
  drop.forEach((k) => delete copy[k]);
  return copy as T;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// ── File storage ──────────────────────────────────────────────────────────────
// Supabase Storage buckets, set up in supabase/phase-4-storage.sql.

export type StorageBucket = 'public-media' | 'documents' | 'student-documents' | 'application-files';

/** Strips characters that would let a filename escape its folder. */
function safeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120);
}

/** Uploads a file and returns its object path within the bucket. */
export async function uploadFile(bucket: StorageBucket, file: File, folder = ''): Promise<string> {
  const path = `${folder ? `${folder}/` : ''}${generateId()}-${safeFileName(file.name)}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) fail('upload the file', error);
  return path;
}

/** Public URL for an object in a public bucket. */
export function publicFileUrl(bucket: StorageBucket, path: string): string {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/** Private buckets are read through short-lived signed URLs, never direct links.
 *  Requires the caller to hold the role the bucket policy asks for. */
export async function getSignedFileUrl(bucket: StorageBucket, path: string, expiresIn = 300): Promise<string | null> {
  if (!path) return null;
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error || !data) return null;
  return data.signedUrl;
}

/** Best-effort removal; a missing object should not block deleting its record. */
export async function deleteFile(bucket: StorageBucket, path: string): Promise<void> {
  if (!path) return;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    // eslint-disable-next-line no-console
    console.warn(`Could not remove ${bucket}/${path}:`, error.message);
  }
}

/**
 * The public admissions form does not allocate numbers or write rows directly;
 * it calls the submit_application RPC, which does both atomically. Returns the
 * allocated student number.
 */
export async function submitApplication(app: Application): Promise<string> {
  const { data, error } = await supabase.rpc('submit_application', { p_data: app });
  if (error) fail('submit the application', error);
  return data as string;
}

export function calculateAverageMark(subjectMarks: SubjectMark[]): number {
  if (!subjectMarks || subjectMarks.length === 0) return 0;
  const total = subjectMarks.reduce((sum, s) => sum + (Number.isFinite(s.mark) ? s.mark : 0), 0);
  return Math.round((total / subjectMarks.length) * 10) / 10;
}

// ── News ──────────────────────────────────────────────────────────────────────

export async function getNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase.from('news').select('*').order('date', { ascending: false });
  if (error) fail('load news', error);
  return (data || []).map((row) => stripMeta<NewsItem>(row, ['created_at', 'updated_at']));
}

export async function setNews(items: NewsItem[]): Promise<void> {
  const { error } = await supabase.from('news').upsert(items, { onConflict: 'id' });
  if (error) fail('save news', error);
}

export async function deleteNews(id: string): Promise<void> {
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) fail('delete news', error);
}

// ── Documents ─────────────────────────────────────────────────────────────────

/** Snake_case columns ↔ camelCase DocumentItem fields. */
function toDocumentRow(doc: DocumentItem) {
  return {
    id: doc.id,
    name: doc.name,
    grade: doc.grade,
    subject: doc.subject,
    file_url: doc.fileUrl,
    file_name: doc.fileName,
    upload_date: doc.uploadDate,
  };
}

function fromDocumentRow(row: Record<string, unknown>): DocumentItem {
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    grade: String(row.grade ?? ''),
    subject: String(row.subject ?? ''),
    fileUrl: String(row.file_url ?? ''),
    fileName: String(row.file_name ?? ''),
    uploadDate: String(row.upload_date ?? ''),
  };
}

export async function getDocuments(): Promise<DocumentItem[]> {
  const { data, error } = await supabase.from('documents').select('*').order('upload_date', { ascending: false });
  if (error) fail('load documents', error);
  return (data || []).map(fromDocumentRow);
}

export async function setDocuments(items: DocumentItem[]): Promise<void> {
  const { error } = await supabase.from('documents').upsert(items.map(toDocumentRow), { onConflict: 'id' });
  if (error) fail('save documents', error);
}

export async function deleteDocument(id: string): Promise<void> {
  const { error } = await supabase.from('documents').delete().eq('id', id);
  if (error) fail('delete document', error);
}

// ── Applications ──────────────────────────────────────────────────────────────

type ApplicationRow = { data: Application } & Record<string, unknown>;

function toApplicationRow(app: Application): ApplicationRow {
  return {
    id: app.id,
    student_number: app.studentNumber,
    first_name: app.firstName,
    last_name: app.lastName,
    grade: app.grade,
    status: app.status,
    submitted_date: app.submittedDate,
    data: app,
  };
}

function fromApplicationRow(row: { data: unknown }): Application {
  return row.data as Application;
}

export async function getApplications(): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('data')
    .order('submitted_date', { ascending: false });
  if (error) fail('load applications', error);
  return (data || []).map(fromApplicationRow);
}

export async function setApplications(items: Application[]): Promise<void> {
  const { error } = await supabase.from('applications').upsert(items.map(toApplicationRow), { onConflict: 'id' });
  if (error) fail('save applications', error);
}

export async function deleteApplication(id: string): Promise<void> {
  const { error } = await supabase.from('applications').delete().eq('id', id);
  if (error) fail('delete the application', error);
}

export type ApplicationStatus = {
  student_number: string;
  first_name: string;
  last_name: string;
  grade: string;
  status: string;
  submitted_date: string;
};

/** Status-only lookup for the public chatbot. Anonymous users cannot read the
 *  applications table, so this calls a narrow RPC that returns just the status. */
export async function lookupApplicationStatus(params: {
  studentNumber?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
}): Promise<ApplicationStatus | null> {
  const { data, error } = await supabase.rpc('application_status', {
    p_student_number: params.studentNumber ?? null,
    p_first_name: params.firstName ?? null,
    p_last_name: params.lastName ?? null,
    p_dob: params.dob ?? null,
  });
  if (error) fail('look up the application', error);
  const rows = (data || []) as ApplicationStatus[];
  return rows.length > 0 ? rows[0] : null;
}

// ── Contact ───────────────────────────────────────────────────────────────────

export async function getContact(): Promise<ContactInfo> {
  const { data, error } = await supabase.from('contact').select('data').eq('id', 'contact').maybeSingle();
  if (error) fail('load contact details', error);
  if (!data) return { address: '', phone: '', email: '', monThu: '', friday: '', weekend: '' };
  return data.data as ContactInfo;
}

export async function setContact(info: ContactInfo): Promise<void> {
  const { error } = await supabase.from('contact').upsert({ id: 'contact', data: info }, { onConflict: 'id' });
  if (error) fail('save contact details', error);
}

// ── About ─────────────────────────────────────────────────────────────────────

export async function getAbout(): Promise<AboutInfo> {
  const { data, error } = await supabase.from('about').select('data').eq('id', 'about').maybeSingle();
  if (error) fail('load the about page', error);
  if (!data) {
    return { historyParagraphs: [], principalName: '', principalTitle: '', principalMessage: [] };
  }
  return data.data as AboutInfo;
}

export async function setAbout(info: AboutInfo): Promise<void> {
  const { error } = await supabase.from('about').upsert({ id: 'about', data: info }, { onConflict: 'id' });
  if (error) fail('save the about page', error);
}

// ── Activities ────────────────────────────────────────────────────────────────

export async function getActivities(): Promise<Activity[]> {
  const { data, error } = await supabase.from('activities').select('*').order('sort_order', { ascending: true });
  if (error) fail('load activities', error);
  return (data || []).map((row) => stripMeta<Activity>(row, ['updated_at', 'sort_order']));
}

export async function setActivities(items: Activity[]): Promise<void> {
  const rows = items.map((item, index) => ({ ...item, sort_order: index }));
  const { error } = await supabase.from('activities').upsert(rows, { onConflict: 'id' });
  if (error) fail('save activities', error);
}

// ── Achievers by year ─────────────────────────────────────────────────────────

export async function getAchieversByYear(year: string): Promise<AchieverEntry[]> {
  const { data, error } = await supabase.from('achievers').select('*').eq('year', year);
  if (error) fail('load achievers', error);
  return (data || []).map((row) => stripMeta<AchieverEntry>(row, ['updated_at', 'year']));
}

export async function setAchieversByYear(year: string, items: AchieverEntry[]): Promise<void> {
  const { error: deleteError } = await supabase.from('achievers').delete().eq('year', year);
  if (deleteError) fail('save achievers', deleteError);

  if (items.length === 0) return;
  const rows = items.map((item) => ({ ...item, year }));
  const { error } = await supabase.from('achievers').insert(rows);
  if (error) fail('save achievers', error);
}

// ── Hall of Fame ──────────────────────────────────────────────────────────────

/** `desc` in the domain type maps to the `description` column. */
function toHallRow(entry: HallOfFameEntry) {
  const { desc, ...rest } = entry;
  return { ...rest, description: desc };
}

function fromHallRow(row: Record<string, unknown>): HallOfFameEntry {
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    title: String(row.title ?? ''),
    year: String(row.year ?? ''),
    desc: String(row.description ?? ''),
    image: String(row.image ?? ''),
  };
}

export async function getHallOfFame(): Promise<HallOfFameEntry[]> {
  const { data, error } = await supabase.from('hall_of_fame').select('*');
  if (error) fail('load the hall of fame', error);
  return (data || []).map(fromHallRow);
}

export async function setHallOfFame(items: HallOfFameEntry[]): Promise<void> {
  const { error } = await supabase.from('hall_of_fame').upsert(items.map(toHallRow), { onConflict: 'id' });
  if (error) fail('save the hall of fame', error);
}

export async function deleteHallOfFame(id: string): Promise<void> {
  const { error } = await supabase.from('hall_of_fame').delete().eq('id', id);
  if (error) fail('delete the entry', error);
}

// ── Results by year ───────────────────────────────────────────────────────────

export async function getResultsByYear(year: string): Promise<YearResults | null> {
  const { data, error } = await supabase.from('results_by_year').select('data').eq('year', year).maybeSingle();
  if (error) fail('load results', error);
  return data ? (data.data as YearResults) : null;
}

export async function setResultsByYear(year: string, data: YearResults): Promise<void> {
  const { error } = await supabase.from('results_by_year').upsert({ year, data }, { onConflict: 'year' });
  if (error) fail('save results', error);
}

// ── Staff profiles ────────────────────────────────────────────────────────────

export type StaffProfile = {
  id: string;
  username: string;
  fullName: string;
  role: string;
};

function fromStaffRow(row: Record<string, unknown>): StaffProfile {
  return {
    id: String(row.id ?? ''),
    username: String(row.username ?? ''),
    fullName: String(row.name ?? ''),
    role: String(row.role ?? 'Unassigned'),
  };
}

export async function getStaffProfiles(): Promise<StaffProfile[]> {
  const { data, error } = await supabase
    .from('staff_profiles')
    .select('id, username, name, role')
    .order('name', { ascending: true });
  if (error) fail('load the staff list', error);
  return (data || []).map(fromStaffRow);
}

/** Role changes are accepted by the database only for Principal/Administrator. */
export async function setStaffRole(id: string, role: string): Promise<void> {
  const { error } = await supabase.from('staff_profiles').update({ role }).eq('id', id);
  if (error) fail('update the staff role', error);
}

