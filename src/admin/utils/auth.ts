import * as React from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../../services/supabase';
import { STAFF_ROLES, type StaffRole } from './roles';

// Staff authentication is enforced by Supabase Auth (server-side). The browser
// holds only a session token; it never holds a password hash or a user table.
//
// The staff role is read from the `staff_profiles` table (Phase 3). It is
// deliberately *not* read from user metadata: metadata is writable by the user
// themselves, so treating it as an authorization input let any account promote
// itself to Principal. The table is the only source, and the database enforces
// the same rules independently.

export { STAFF_ROLES, type StaffRole };

export type AdminUser = {
  id: string;
  username: string;
  name: string;
  role: string;
  requiresSetup: boolean;
};

export type AuthResult = {
  success: boolean;
  error?: string;
  user?: AdminUser;
  requiresSetup?: boolean;
};

/** Supabase Auth wants an email. Staff log in with short usernames, so we map
 *  them onto a single internal domain when the input is not already an email. */
const STAFF_EMAIL_DOMAIN = 'staff.jojosss.local';

export function toStaffEmail(usernameOrEmail: string): string {
  const value = usernameOrEmail.trim().toLowerCase();
  return value.includes('@') ? value : `${value}@${STAFF_EMAIL_DOMAIN}`;
}

/** Builds an AdminUser from the auth session plus the profile row. `role` comes
 *  from the database; a missing profile means the account is not yet a staff
 *  member and gets the least-privileged `Unassigned` role. */
function toAdminUser(user: User | null | undefined, profile?: StaffProfileRow | null): AdminUser {
  if (!user) {
    return { id: '', username: '', name: 'Staff', role: 'Unassigned', requiresSetup: false };
  }
  const meta = (user.user_metadata || {}) as Record<string, unknown>;
  const username =
    profile?.username ||
    (typeof meta.username === 'string' ? meta.username : (user.email || '').split('@')[0]);
  const name = profile?.name || (typeof meta.name === 'string' ? meta.name : username) || 'Staff';
  const role = typeof profile?.role === 'string' ? profile.role : 'Unassigned';
  const requiresSetup = meta.requires_setup === true;

  return { id: user.id, username, name, role, requiresSetup };
}

type StaffProfileRow = { username: string | null; name: string | null; role: string | null };

/** Loads the caller's own staff profile. Returns null when no row exists. */
async function loadProfile(userId: string): Promise<StaffProfileRow | null> {
  const { data, error } = await supabase
    .from('staff_profiles')
    .select('username, name, role')
    .eq('id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return data as StaffProfileRow;
}

async function resolveAdminUser(user: User | null | undefined): Promise<AdminUser | null> {
  if (!user) return null;
  return toAdminUser(user, await loadProfile(user.id));
}

function readableError(error: { message?: string } | null): string {
  const message = error?.message || 'Something went wrong. Please try again.';
  if (/invalid login credentials/i.test(message)) return 'Invalid username or password.';
  if (/email not confirmed/i.test(message)) {
    return 'This account has not been confirmed yet. Please contact the school administrator.';
  }
  if (/password.*(at least|characters)/i.test(message)) {
    return 'Password must be at least 6 characters.';
  }
  return message;
}

export function isAuthConfigured(): boolean {
  return isSupabaseConfigured;
}

export async function getSession(): Promise<Session | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session;
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const session = await getSession();
  return resolveAdminUser(session?.user);
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()) !== null;
}

/** Emits the current user whenever the session changes. The callback is async
 *  because the role has to be fetched from the profiles table on each change. */
export function onAuthStateChange(callback: (user: AdminUser | null) => void): () => void {
  if (!isSupabaseConfigured) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    resolveAdminUser(session?.user).then(callback);
  });
  return () => data.subscription.unsubscribe();
}

export async function login(username: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Staff portal is not configured. Please contact the school administrator.',
    };
  }

  const email = toStaffEmail(username);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { success: false, error: readableError(error) };

  const user = await resolveAdminUser(data.user);
  if (!user) return { success: false, error: 'Could not load your staff profile.' };

  return { success: true, user, requiresSetup: user.requiresSetup };
}

/** Completes first-login setup by setting the account's own password. */
export async function setAdminPassword(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Staff portal is not configured.' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  // The account is already signed in during first-login setup, so the update
  // applies to the current session's user.
  const { error } = await supabase.auth.updateUser({
    password,
    data: { requires_setup: false },
  });

  if (error) return { success: false, error: readableError(error) };
  return { success: true };
}

/** Starts the password reset flow. The Supabase email template must be pointed
 *  at the site's own reset page so the recovery link returns here. */
export async function requestPasswordReset(username: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Staff portal is not configured.' };
  }
  const { error } = await supabase.auth.resetPasswordForEmail(toStaffEmail(username), {
    redirectTo: `${window.location.origin}/admin/login`,
  });
  if (error) return { success: false, error: readableError(error) };
  return { success: true };
}

export async function logout(): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.auth.signOut();
}

export { readableError };

/** React helper: subscribes to auth state and exposes a `loading` flag while
 *  the initial session is being restored, so guards don't redirect too early. */
export function useAuth(): { user: AdminUser | null; loading: boolean } {
  const [user, setUser] = React.useState<AdminUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;

    getCurrentAdmin()
      .then((current) => {
        if (active) setUser(current);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const unsubscribe = onAuthStateChange((next) => {
      if (active) setUser(next);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return { user, loading };
}