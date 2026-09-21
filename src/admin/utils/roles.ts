// Role definitions and access rules for the staff portal.
//
// The browser only *reflects* these rules: the authoritative copy lives in
// supabase/phase-3-rbac.sql, where every write policy consults the caller's role
// from the staff_profiles table. Hiding a tab here improves the UX; the database
// independently refuses the write if someone bypasses the UI.

export const STAFF_ROLES = [
  'Principal',
  'Deputy Principal',
  'Administrator',
  'HOD',
  'Maintenance',
  'Unassigned',
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

/** Roles that may edit public website content. */
const CONTENT_ROLES: readonly StaffRole[] = ['Principal', 'Deputy Principal', 'Administrator', 'HOD'];

/** Roles that may read learner applications. */
const APPLICATION_ROLES: readonly StaffRole[] = ['Principal', 'Deputy Principal', 'Administrator', 'HOD'];

/** Roles that may read and write per-student documents. */
const STUDENT_DOC_ROLES: readonly StaffRole[] = ['Principal', 'Deputy Principal', 'Administrator'];

/** Roles that may change other staff members' roles. */
const STAFF_ADMIN_ROLES: readonly StaffRole[] = ['Principal', 'Administrator'];

export type AdminSectionKey =
  | 'dashboard'
  | 'news'
  | 'about'
  | 'achievements'
  | 'documents'
  | 'extra-curricular'
  | 'applications'
  | 'student-documents'
  | 'contact'
  | 'staff';

/** Which roles may reach each section of the portal. Anything not listed is
 *  reachable by every signed-in staff member. */
const SECTION_ROLES: Record<AdminSectionKey, readonly StaffRole[]> = {
  dashboard: STAFF_ROLES,
  news: CONTENT_ROLES,
  about: CONTENT_ROLES,
  achievements: CONTENT_ROLES,
  documents: CONTENT_ROLES,
  'extra-curricular': CONTENT_ROLES,
  applications: APPLICATION_ROLES,
  'student-documents': STUDENT_DOC_ROLES,
  contact: CONTENT_ROLES,
  staff: STAFF_ADMIN_ROLES,
};

export function isStaffRole(value: unknown): value is StaffRole {
  return typeof value === 'string' && (STAFF_ROLES as readonly string[]).includes(value);
}

export function hasRole(role: string | null | undefined, allowed: readonly StaffRole[]): boolean {
  return isStaffRole(role) && allowed.includes(role);
}

export function canAccessSection(role: string | null | undefined, section: AdminSectionKey): boolean {
  return hasRole(role, SECTION_ROLES[section]);
}

export function canWriteContent(role: string | null | undefined): boolean {
  return hasRole(role, CONTENT_ROLES);
}

export function canViewApplications(role: string | null | undefined): boolean {
  return hasRole(role, APPLICATION_ROLES);
}

export function canManageStudentDocs(role: string | null | undefined): boolean {
  return hasRole(role, STUDENT_DOC_ROLES);
}

export function isStaffAdmin(role: string | null | undefined): boolean {
  return hasRole(role, STAFF_ADMIN_ROLES);
}

/** `Unassigned` means the account exists but nobody has granted it a role yet. */
export function needsRoleAssignment(role: string | null | undefined): boolean {
  return role === 'Unassigned' || !isStaffRole(role);
}