import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';

export default function RequireAuth({ children }){
  const { authed, authLoading } = useUser();
  const location = useLocation();

  if(authLoading){
    return <div className="page-loading">Loading…</div>;
  }
  if(!authed){
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
