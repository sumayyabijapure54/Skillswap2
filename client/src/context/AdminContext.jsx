import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { useUser } from './UserContext.jsx';

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
  const { authed, isAdmin } = useUser();
  const [state, setState] = useState({
    users: [],
    mentorApplications: [],
    reports: [],
    mentors: [],
    mentorsError: null,
    mentorsLoading: true,
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
      setState(s => ({
        ...s,
        users: (usersData.users || []).map(toDisplayUser),
        mentorApplications: appsData.applications || [],
        reports: reportsData.reports || [],
        loading: false,
        error: null
      }));
    } catch (err) {
      setState(s => ({ ...s, loading: false, error: err.message }));
    }
    // Loaded independently so a Top Mentors failure never blocks the rest
    // of the admin dashboard (users/applications/reports) from working.
    refreshMentors();
  };

  const refreshMentors = async () => {
    setState(s => ({ ...s, mentorsLoading: true }));
    try {
      const data = await api.get('/api/admin/mentors');
      setState(s => ({ ...s, mentors: data.mentors || [], mentorsError: null, mentorsLoading: false }));
    } catch (err) {
      setState(s => ({ ...s, mentorsError: err.message, mentorsLoading: false }));
    }
  };

  const featureMentor = async (id) => {
    await api.put(`/api/admin/mentors/${id}/feature`);
    await refreshMentors();
  };

  const unfeatureMentor = async (id) => {
    await api.put(`/api/admin/mentors/${id}/unfeature`);
    await refreshMentors();
  };

  const reorderTopMentors = async (order) => {
    await api.put('/api/admin/mentors/top/order', { order });
    await refreshMentors();
  };

  // This provider wraps the entire app (see main.jsx), but its data is
  // only ever read by the admin pages (RequireAdmin-gated). Previously
  // `load()` ran unconditionally on mount, meaning every single visitor —
  // logged out or a regular learner/mentor — fired three admin-only
  // requests on every page load and always got 403'd. Only real admins
  // need this data, so only fetch it for them.
  useEffect(() => {
    if (!authed || !isAdmin) {
      setState(s => ({ ...s, loading: false }));
      return;
    }
    load();
  }, [authed, isAdmin]);

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
    resolveReport,
    refreshMentors, featureMentor, unfeatureMentor, reorderTopMentors
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside <AdminProvider>');
  return ctx;
}
