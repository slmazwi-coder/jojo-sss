import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './utils/auth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
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

  return <>{children}</>;
};
