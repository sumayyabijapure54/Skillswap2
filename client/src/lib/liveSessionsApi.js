import { api } from './api.js';

// Thin wrapper around /api/live-sessions/* (see
// server/src/controllers/liveSessionsController.js). Kept separate from
// mentorApi.js since live sessions are used by both mentor and student
// surfaces, unlike the chatbot helpers there.

export function createLiveSession(payload) {
  return api.post('/api/live-sessions', payload);
}

export function updateLiveSession(id, payload) {
  return api.patch(`/api/live-sessions/${id}`, payload);
}

export function deleteLiveSession(id) {
  return api.del(`/api/live-sessions/${id}`);
}

export function cancelLiveSession(id) {
  return api.patch(`/api/live-sessions/${id}/cancel`);
}

export function startLiveSession(id) {
  return api.post(`/api/live-sessions/${id}/start`);
}

export function endLiveSession(id, recordingUrl) {
  return api.post(`/api/live-sessions/${id}/end`, recordingUrl ? { recordingUrl } : {});
}

export function attachRecording(id, recordingUrl) {
  return api.patch(`/api/live-sessions/${id}/recording`, { recordingUrl });
}

export function joinLiveSession(id) {
  return api.post(`/api/live-sessions/${id}/join`);
}

// Call only after the Jitsi embed's videoConferenceJoined event actually
// fires (see JitsiEmbed.jsx + LiveSessionDetail.jsx) — this is what flips
// attendance from "connecting" to "present" and starts the duration clock.
export function confirmLiveSessionJoin(id) {
  return api.post(`/api/live-sessions/${id}/confirm-join`);
}

export function leaveLiveSession(id) {
  return api.post(`/api/live-sessions/${id}/leave`);
}

export function getLiveSession(id) {
  return api.get(`/api/live-sessions/${id}`);
}

export function listLiveSessions(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return api.get(`/api/live-sessions${qs ? `?${qs}` : ''}`);
}

export function getAttendance(id) {
  return api.get(`/api/live-sessions/${id}/attendance`);
}

// Student
export const myUpcomingLiveSessions = () => api.get('/api/live-sessions/my/upcoming');
export const myLiveLiveSessions = () => api.get('/api/live-sessions/my/live');
export const myLiveSessionHistory = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return api.get(`/api/live-sessions/my/history${qs ? `?${qs}` : ''}`);
};

// Mentor
export const mentorUpcomingLiveSessions = () => api.get('/api/live-sessions/mentor/upcoming');
export const mentorTodayLiveSessions = () => api.get('/api/live-sessions/mentor/today');
