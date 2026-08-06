import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';

export default function RequireAdmin({ children }) {
  const { authed, authLoading, isAdmin } = useUser();

  if (authLoading) {
    return <div className="page-loading">Loading…</div>;
  }
  if (!authed) return <Navigate to="/login" replace />;
  // Only the real, server-issued `isAdmin` flag counts — granted via
  // ADMIN_EMAILS at signup or by another admin through the Users page.
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
}
