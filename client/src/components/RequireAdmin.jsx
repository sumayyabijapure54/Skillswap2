import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';

export default function RequireAdmin({ children }) {
  const { authed, authLoading, isAdmin, profile } = useUser();

  if (authLoading) {
    return <div className="page-loading">Loading…</div>;
  }
  if (!authed) return <Navigate to="/login" replace />;
  // Real backend-granted admins (server's `isAdmin`) OR the demo toggle on
  // the Profile page (`profile.role === 'admin'`) both count — see Profile.jsx.
  if (!isAdmin && profile.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
}
