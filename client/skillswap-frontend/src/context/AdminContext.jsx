import React, { createContext, useContext, useEffect, useState } from 'react';
import { seedUsers, seedMentorApplications, seedReports } from '../data/adminSeed.js';

const AdminContext = createContext(null);
const STORAGE_KEY = 'skillswap_admin_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function seedState() {
  return {
    users: seedUsers,
    mentorApplications: seedMentorApplications,
    reports: seedReports
  };
}

export function AdminProvider({ children }) {
  const [state, setState] = useState(() => loadState() || seedState());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const suspendUser = (id) => setState(s => ({
    ...s, users: s.users.map(u => u.id === id ? { ...u, status: 'suspended' } : u)
  }));

  const reinstateUser = (id) => setState(s => ({
    ...s, users: s.users.map(u => u.id === id ? { ...u, status: 'active' } : u)
  }));

  const approveMentorApplication = (id) => setState(s => {
    const app = s.mentorApplications.find(a => a.id === id);
    if (!app) return s;
    const newUser = {
      id: `u-${Date.now()}`, name: app.name, email: `${app.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      role: 'mentor', status: 'active', joinedAt: new Date().toISOString()
    };
    return {
      ...s,
      mentorApplications: s.mentorApplications.map(a => a.id === id ? { ...a, status: 'approved' } : a),
      users: [newUser, ...s.users]
    };
  });

  const rejectMentorApplication = (id) => setState(s => ({
    ...s, mentorApplications: s.mentorApplications.map(a => a.id === id ? { ...a, status: 'rejected' } : a)
  }));

  const resolveReport = (id) => setState(s => ({
    ...s, reports: s.reports.map(r => r.id === id ? { ...r, status: 'resolved' } : r)
  }));

  const value = {
    ...state,
    suspendUser, reinstateUser,
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
