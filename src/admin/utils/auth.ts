import * as React from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../../services/supabase';

// Staff authentication is enforced by Supabase Auth (server-side). The browser
// holds only a session token; it never holds a password hash or a user table.
//
// Phase 1 note: role information is read from a `staff_profiles` table when it
// exists, and falls back to user metadata otherwise. Phase 3 promotes this to a
// dedicated profiles table with role-based access control on the routes.

export type StaffRole =
  | 'Principal'
  | 'Deputy Principal'
  | 'Administrator'
  | 'HOD'
  | 'Maintenance';

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

function toAdminUser(user: User | null | undefined): AdminUser {
  if (!user) {
    return { id: '', username: '', name: 'Staff', role: 'Staff', requiresSetup: false };
  }
  const meta = (user.user_metadata || {}) as Record<string, unknown>;
  const username = typeof meta.username === 'string' ? meta.username : (user.email || '').split('@')[0];
  const name = typeof meta.name === 'string' ? meta.name : username || 'Staff';
  const role = typeof meta.role === 'string' ? meta.role : 'Staff';
  const requiresSetup = meta.requires_setup === true;

  return { id: user.id, username, name, role, requiresSetup };
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
  return session ? toAdminUser(session.user) : null;
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()) !== null;
}

export function onAuthStateChange(callback: (user: AdminUser | null) => void): () => void {
  if (!isSupabaseConfigured) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session ? toAdminUser(session.user) : null);
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

  const user = toAdminUser(data.user);
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

export { toAdminUser, readableError };

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