import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './utils/auth';
import { canAccessSection, type AdminSectionKey } from './utils/roles';

/** Gates the staff portal on a signed-in session. When `section` is given, the
 *  caller's role must also permit that section.
 *
 *  This is a UX guard, not the security boundary: the database re-checks the
 *  same rules through RLS, so bypassing the redirect still yields no access. */
export const ProtectedRoute = ({
  children,
  section,
}: {
  children: React.ReactNode;
  section?: AdminSectionKey;
}) => {
  const { user, loading } = useAuth();

  // Wait for the session to be restored before deciding, otherwise a valid
  // session would briefly redirect to the login page on every reload.
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400 text-sm">
        Checking your session…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (section && !canAccessSection(user.role, section)) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

/** Shown when a signed-in account has no role yet, instead of the content UI. */
export const NoRoleNotice = () => (
  <div className="max-w-xl mx-auto mt-16 bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
    <h1 className="text-xl font-bold mb-3">Your account has no role yet</h1>
    <p className="text-gray-400 text-sm">
      A Principal or Administrator needs to assign you a role before you can use the staff portal.
      Please contact the school administrator.
    </p>
  </div>
);
