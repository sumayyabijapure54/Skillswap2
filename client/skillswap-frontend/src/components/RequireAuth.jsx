import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';

export default function RequireAuth({ children }){
  const { authed } = useUser();
  const location = useLocation();

  if(!authed){
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
