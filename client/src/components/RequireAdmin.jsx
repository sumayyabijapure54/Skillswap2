import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';

export default function RequireAdmin({ children }) {
  const { authed, profile } = useUser();

  if (!authed) return <Navigate to="/login" replace />;
  if (profile.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
}
