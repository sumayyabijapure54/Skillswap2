import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api.js';

const AdminContext = createContext(null);

// Real user.role values are 'learn' | 'teach' | 'both' | null (see
// server/src/models/User.js). The admin UI (AdminUsers/AdminOverview)
// was originally built against mock 'mentor'/'learner' labels — this maps
// the real enum onto that same display shape rather than rewriting every
// page that reads `.role`.
function toDisplayUser(u) {
  return {
    ...u,
    // listUsers (leanAdminUser) returns `id`, but the suspend/reinstate/
    // make-admin/revoke-admin controllers return a raw User doc where
    // toJSON only strips sensitive fields and never maps _id -> id.
    // Normalize here so every user object in state has `.id` either way.
    id: u.id || u._id,
    accountRole: u.role, // real enum, kept around in case it's needed
    role: u.role === 'teach' || u.role === 'both' ? 'mentor' : 'learner'
  };
}

export function AdminProvider({ children }) {
  const [state, setState] = useState({
    users: [],
    mentorApplications: [],
    reports: [],
    loading: true,
    error: null
  });

  const load = async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const [usersData, appsData, reportsData] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/mentor-applications'),
        api.get('/api/reports')
      ]);
      setState({
        users: (usersData.users || []).map(toDisplayUser),
        mentorApplications: appsData.applications || [],
        reports: reportsData.reports || [],
        loading: false,
        error: null
      });
    } catch (err) {
      setState(s => ({ ...s, loading: false, error: err.message }));
    }
  };

  useEffect(() => { load(); }, []);

  const suspendUser = async (id) => {
    const data = await api.patch(`/api/admin/users/${id}/suspend`);
    setState(s => ({ ...s, users: s.users.map(u => u.id === id ? toDisplayUser(data.user) : u) }));
  };

  const reinstateUser = async (id) => {
    const data = await api.patch(`/api/admin/users/${id}/reinstate`);
    setState(s => ({ ...s, users: s.users.map(u => u.id === id ? toDisplayUser(data.user) : u) }));
  };

  const makeAdmin = async (id) => {
    const data = await api.patch(`/api/admin/users/${id}/make-admin`);
    setState(s => ({ ...s, users: s.users.map(u => u.id === id ? toDisplayUser(data.user) : u) }));
  };

  const revokeAdmin = async (id) => {
    const data = await api.patch(`/api/admin/users/${id}/revoke-admin`);
    setState(s => ({ ...s, users: s.users.map(u => u.id === id ? toDisplayUser(data.user) : u) }));
  };

  const approveMentorApplication = async (id) => {
    const data = await api.patch(`/api/mentor-applications/${id}/approve`);
    setState(s => ({ ...s, mentorApplications: s.mentorApplications.map(a => a.id === id ? data.application : a) }));
    // Approval flips the applicant's role server-side (learn -> both, or
    // sets teach) — refresh users so AdminUsers reflects that immediately.
    load();
  };

  const rejectMentorApplication = async (id) => {
    const data = await api.patch(`/api/mentor-applications/${id}/reject`);
    setState(s => ({ ...s, mentorApplications: s.mentorApplications.map(a => a.id === id ? data.application : a) }));
  };

  const resolveReport = async (id) => {
    const data = await api.patch(`/api/reports/${id}/resolve`);
    setState(s => ({ ...s, reports: s.reports.map(r => r.id === id ? data.report : r) }));
  };

  const value = {
    ...state,
    refresh: load,
    suspendUser, reinstateUser,
    makeAdmin, revokeAdmin,
    approveMentorApplication, rejectMentorApplication,
    resolveReport
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside <AdminProvider>');
  return ctx;
}
