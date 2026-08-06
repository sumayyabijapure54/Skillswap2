import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setTokens, clearTokens } from '../lib/api.js';
import { getSocket, disconnectSocket } from '../lib/socket.js';

const UserContext = createContext(null);
const STORAGE_KEY = 'skillswap_user_v1';

// Maps a backend User document (see server/src/models/User.js) onto the
// slice of local state that's server-driven. Progress (enrolled) and
// notifications are hydrated separately via hydrateUserCollections, since
// they live in their own collections. Bookings, messages, and wallet
// transaction history each live on their own pages now (Sessions/
// SessionDetail, Messages, PaymentHistory) and fetch straight from their
// real API endpoints rather than going through this context — only the
// wallet *balance* stays here since it's shown in a few places at once.
function userToProfileState(user) {
  return {
    authed: true,
    verified: !!user.verified,
    onboarded: !!user.onboarded,
    isAdmin: !!user.isAdmin,
    profile: {
      id: user._id || user.id,
      name: user.name || '',
      email: user.email || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
      role: user.role || null,
      skillsOffered: user.skillsOffered || [],
      skillsWanted: user.skillsWanted || [],
      interests: user.interests || [],
      goal: user.goal || null
    },
    wallet: { balance: user.wallet?.balance ?? 0 },
    wishlist: user.wishlist || []
  };
}

// Pulls the two collections that live outside the User document itself
// (Progress, Notification) and merges them in. Called after any successful
// auth event — best-effort: a hydration failure leaves whatever was already
// in state rather than wiping it out.
async function hydrateUserCollections(setState) {
  try {
    const [progressData, notifData] = await Promise.all([
      api.get('/api/progress'),
      api.get('/api/notifications')
    ]);
    setState(s => ({
      ...s,
      enrolled: progressData.enrolled || [],
      notifications: notifData.notifications || []
    }));
  } catch {
    // best-effort — keep existing state
  }
}

const SEED_NOTIFICATIONS = [
  { id:1, type:'booking', text:'Your session "UI/UX Design Workshop" with Sarah Williams is confirmed for tomorrow.', time:'2h ago', read:false },
  { id:2, type:'message', text:'Alex Johnson replied to your question in React Fundamentals.', time:'5h ago', read:false },
  { id:3, type:'recommendation', text:'New skill match: "SEO & Growth Marketing" fits what you\'ve been learning.', time:'1d ago', read:false },
  { id:4, type:'system', text:'Welcome to SkillSwap! Complete your profile to get better matches.', time:'3d ago', read:true }
];

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return null;
    const parsed = JSON.parse(raw);
    // Merge in any keys added since this user's state was first saved
    // (e.g. savedLessons/lastWatched from the YouTube lesson player) so
    // older localStorage payloads don't crash newer code that expects them.
    return { ...emptyState(), ...parsed };
  }catch{
    return null;
  }
}

function emptyState(){
  return {
    authed: false,
    verified: false,
    onboarded: false,
    isAdmin: false,
    profile: { id:null, name:'', email:'', bio:'', avatar:'', role:null, interests:[], goal:null, skillsOffered:[], skillsWanted:[] },
    enrolled: [],      // [{ skillId, completedLessons:[lessonId,...], enrolledAt, quizScores:{lessonId:{score,total}} }]
    wishlist: [],       // [skillId, ...]
    notifications: SEED_NOTIFICATIONS,
    savedLessons: [],  // [{ skillId, videoId, title, thumbnail, channelTitle, savedAt }]
    lastWatched: {},   // { [skillId]: { videoId, lessonIndex, updatedAt } }
    wallet: { balance: 0 },
    settings: { emailNotifs:true, pushNotifs:true, smsNotifs:false, connectedGoogle:false, connectedGithub:false }
  };
}

export function UserProvider({ children }){
  const [state, setState] = useState(()=> loadState() || emptyState());
  const [liveConnected, setLiveConnected] = useState(false);
  // True while we're checking an existing token against the backend on
  // first load — RequireAuth waits on this instead of bouncing straight
  // to /login for a session that's actually still valid.
  const [authLoading, setAuthLoading] = useState(()=> !!getToken());

  useEffect(()=>{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // On first load, if we have a token from a previous session, ask the
  // backend who it belongs to and hydrate real profile/auth state from
  // that — rather than trusting whatever was last cached in localStorage.
  useEffect(()=>{
    let cancelled = false;
    (async () => {
      const token = getToken();
      if(!token){ setAuthLoading(false); return; }
      try{
        const data = await api.get('/api/auth/me');
        if(cancelled) return;
        setState(s => ({ ...s, ...userToProfileState(data.user) }));
        hydrateUserCollections(setState);
      }catch{
        if(cancelled) return;
        clearTokens();
        setState(emptyState());
      }finally{
        if(!cancelled) setAuthLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Real-time notifications: the backend pushes `notification:new` over
  // socket.io the moment something happens (see server/src/utils/notify.js)
  // rather than us finding out up to 40s later. `liveConnected` reflects the
  // actual socket state now, not just "we're logged in" — the UI can use it
  // to show a live/offline indicator. A slow fallback poll stays in place
  // for the rare case the socket can't establish (e.g. corporate proxy
  // blocking websockets) so notifications still arrive, just less promptly.
  useEffect(()=>{
    if(!state.authed) { setLiveConnected(false); return; }

    const socket = getSocket();
    const poll = async () => {
      try{
        const data = await api.get('/api/notifications');
        setState(s => ({ ...s, notifications: data.notifications || s.notifications }));
      }catch{
        // best-effort — a failed poll just tries again next tick
      }
    };
    const fallbackInterval = setInterval(poll, 40000);

    if(!socket){
      setLiveConnected(false);
      return () => clearInterval(fallbackInterval);
    }

    const onConnect = () => setLiveConnected(true);
    const onDisconnect = () => setLiveConnected(false);
    const onNotification = (notification) => {
      setState(s => {
        if(s.notifications.some(n => n.id === notification.id || n._id === notification._id)) return s;
        return { ...s, notifications: [notification, ...s.notifications] };
      });
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('notification:new', onNotification);
    if(socket.connected) onConnect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('notification:new', onNotification);
      clearInterval(fallbackInterval);
    };
  }, [state.authed]);

  // Disconnect the socket on logout so a stale connection (and its auth
  // token) doesn't linger past the session that created it.
  useEffect(()=>{
    if(!state.authed) disconnectSocket();
  }, [state.authed]);

  // --- real auth/profile actions, backed by the Express API (server/) ---

  const signUp = async ({ name, email, password }) => {
    try{
      const data = await api.post('/api/auth/signup', { name, email, password });
      setTokens(data);
      setState(s => ({ ...s, ...userToProfileState(data.user) }));
      hydrateUserCollections(setState);
      return { ok:true };
    }catch(err){
      return { ok:false, error: err.message };
    }
  };

  const logIn = async ({ email, password }) => {
    try{
      const data = await api.post('/api/auth/login', { email, password });
      setTokens(data);
      setState(s => ({ ...s, ...userToProfileState(data.user) }));
      hydrateUserCollections(setState);
      return { ok:true, verified: !!data.user.verified, onboarded: !!data.user.onboarded };
    }catch(err){
      return { ok:false, error: err.message };
    }
  };

  // Shared by the Google/Facebook buttons — `path` is the provider-specific
  // endpoint, `payload` is whatever profile token that provider handed us.
  // Same response shape as email/password login, so callers don't need to
  // know which provider was used.
  const socialLogin = async (path, payload) => {
    try{
      const data = await api.post(path, payload);
      setTokens(data);
      setState(s => ({ ...s, ...userToProfileState(data.user) }));
      hydrateUserCollections(setState);
      return { ok:true, verified: !!data.user.verified, onboarded: !!data.user.onboarded };
    }catch(err){
      return { ok:false, error: err.message };
    }
  };

  const logInWithGoogle = (credential) => socialLogin('/api/auth/google', { credential });
  const logInWithFacebook = (accessToken) => socialLogin('/api/auth/facebook', { accessToken });

  // POST /api/auth/verify-email { otp } — requires the token issued at
  // signup, which is already stored by the time this is called.
  const verifyEmailOtp = async (otp) => {
    try{
      const data = await api.post('/api/auth/verify-email', { otp });
      setState(s => ({ ...s, verified: !!data.user.verified }));
      return { ok:true };
    }catch(err){
      return { ok:false, error: err.message };
    }
  };

  const resendOtp = async () => {
    try{
      await api.post('/api/auth/resend-otp', {});
      return { ok:true };
    }catch(err){
      return { ok:false, error: err.message };
    }
  };

  // Always resolves ok — the backend deliberately responds identically
  // whether or not the email is registered, so this can't be used to
  // enumerate accounts.
  const requestPasswordReset = async (email) => {
    try{
      const data = await api.post('/api/auth/forgot-password', { email });
      return { ok:true, message: data.message };
    }catch(err){
      return { ok:false, error: err.message };
    }
  };

  const confirmPasswordReset = async (token, password) => {
    try{
      const data = await api.post('/api/auth/reset-password', { token, password });
      return { ok:true, message: data.message };
    }catch(err){
      return { ok:false, error: err.message };
    }
  };

  const completeOnboarding = async ({ role, interests, goal }) => {
    try{
      const data = await api.patch('/api/users/me/onboarding', { role, interests, goal });
      setState(s => ({ ...s, ...userToProfileState(data.user) }));
      return { ok:true };
    }catch(err){
      return { ok:false, error: err.message };
    }
  };

  const logOut = async () => {
    try{ await api.post('/api/auth/logout', {}); }catch{ /* best-effort */ }
    clearTokens();
    setState(emptyState());
  };

  // Only real profile fields (name/email/bio/avatar/skillsOffered/skillsWanted)
  // are sent to the backend — anything else (like the local-only admin demo
  // toggle below) is applied to state without a network round-trip.
  const PROFILE_API_FIELDS = ['name','email','bio','avatar','skillsOffered','skillsWanted'];
  const updateProfile = async (patch) => {
    const apiPatch = {};
    for(const k of PROFILE_API_FIELDS) if(patch[k] !== undefined) apiPatch[k] = patch[k];

    if(Object.keys(apiPatch).length === 0){
      setState(s => ({ ...s, profile:{ ...s.profile, ...patch } }));
      return { ok:true };
    }
    try{
      const data = await api.patch('/api/users/me', apiPatch);
      setState(s => ({ ...s, profile:{ ...s.profile, ...userToProfileState(data.user).profile, ...patch } }));
      return { ok:true };
    }catch(err){
      return { ok:false, error: err.message };
    }
  };

  // POST /api/users/me/avatar — multipart/form-data, field name "avatar".
  // Backend (see server/src/middleware/upload.js) caps this at 2MB and
  // only accepts JPEG/PNG/WEBP; those constraints surface as err.message.
  const uploadAvatar = async (file) => {
    try{
      const formData = new FormData();
      formData.append('avatar', file);
      const data = await api.post('/api/users/me/avatar', formData);
      setState(s => ({ ...s, profile:{ ...s.profile, avatar: data.user.avatar } }));
      return { ok:true };
    }catch(err){
      return { ok:false, error: err.message };
    }
  };

  const removeAvatar = async () => {
    try{
      const data = await api.del('/api/users/me/avatar');
      setState(s => ({ ...s, profile:{ ...s.profile, avatar: data.user?.avatar || '' } }));
      return { ok:true };
    }catch(err){
      return { ok:false, error: err.message };
    }
  };

  const changePassword = async ({ current, next }) => {
    try{
      await api.patch('/api/users/me/password', { currentPassword: current, newPassword: next });
      return { ok:true };
    }catch(err){
      return { ok:false, error: err.message };
    }
  };

  const deleteAccount = async () => {
    try{
      await api.del('/api/users/me');
      clearTokens();
      setState(emptyState());
      return { ok:true };
    }catch(err){
      return { ok:false, error: err.message };
    }
  };

  const enroll = (skillId) => {
    setState(s => {
      if(s.enrolled.some(e=>e.skillId===skillId)) return s;
      return { ...s, enrolled:[...s.enrolled, { skillId, completedLessons:[], enrolledAt:new Date().toISOString() }] };
    });
    api.post(`/api/progress/${skillId}/enroll`, {}).catch(()=>{ /* optimistic — will re-sync on next hydration */ });
  };

  const markLessonComplete = (skillId, lessonId) => {
    setState(s => ({
      ...s,
      enrolled: s.enrolled.some(e=>e.skillId===skillId)
        ? s.enrolled.map(e => e.skillId===skillId && !e.completedLessons.includes(lessonId)
            ? { ...e, completedLessons:[...e.completedLessons, lessonId] }
            : e)
        : [...s.enrolled, { skillId, completedLessons:[lessonId], enrolledAt:new Date().toISOString() }]
    }));
    api.post(`/api/progress/${skillId}/lessons/${lessonId}/complete`, {})
      .then(data => {
        // The backend auto-issues a certificate if this was the skill's last
        // lesson — surface that as a real notification instead of silently
        // dropping it (the frontend has no other signal a cert was issued).
        if(data && data.certificate){
          setState(s => ({
            ...s,
            notifications: [
              { id: Date.now(), type:'system', text:`Certificate issued for completing ${skillId}!`, time:'Just now', read:false },
              ...s.notifications
            ]
          }));
        }
      })
      .catch(()=>{ /* optimistic — will re-sync on next hydration */ });
  };

  const recordQuizScore = (skillId, lessonId, score, total) => {
    setState(s => ({
      ...s,
      enrolled: s.enrolled.map(e => e.skillId===skillId
        ? { ...e, quizScores: { ...(e.quizScores||{}), [lessonId]: { score, total } } }
        : e)
    }));
    api.post(`/api/progress/${skillId}/lessons/${lessonId}/quiz`, { score, total }).catch(()=>{});
  };

  const toggleWishlist = (skillId) => {
    setState(s => ({
      ...s,
      wishlist: s.wishlist.includes(skillId) ? s.wishlist.filter(id=>id!==skillId) : [...s.wishlist, skillId]
    }));
    api.post(`/api/wishlist/${skillId}/toggle`, {}).catch(()=>{ /* optimistic — will re-sync on next hydration */ });
  };

  // --- YouTube lesson player: save-for-later + continue-watching --------

  // `chapter` is { chapterId, videoId, startSeconds, title, thumbnail, channelTitle }.
  // Saved by chapterId (not videoId) because a skill's whole curriculum now
  // lives inside one video — chapterId is what makes each topic distinct.
  const toggleSavedLesson = (skillId, chapter) => setState(s => {
    const exists = s.savedLessons.some(l => l.skillId===skillId && l.chapterId===chapter.chapterId);
    return {
      ...s,
      savedLessons: exists
        ? s.savedLessons.filter(l => !(l.skillId===skillId && l.chapterId===chapter.chapterId))
        : [...s.savedLessons, {
            skillId, chapterId: chapter.chapterId, videoId: chapter.videoId, startSeconds: chapter.startSeconds,
            title: chapter.title, thumbnail: chapter.thumbnail, channelTitle: chapter.channelTitle,
            savedAt: new Date().toISOString()
          }]
    };
  });

  const isLessonSaved = (skillId, chapterId) =>
    state.savedLessons.some(l => l.skillId===skillId && l.chapterId===chapterId);

  const setLastWatched = (skillId, { videoId, lessonIndex }) => setState(s => ({
    ...s,
    lastWatched: { ...s.lastWatched, [skillId]: { videoId, lessonIndex, updatedAt: new Date().toISOString() } }
  }));

  const markNotifRead = (id) => {
    setState(s => ({
      ...s, notifications: s.notifications.map(n => n.id===id ? { ...n, read:true } : n)
    }));
    api.patch(`/api/notifications/${id}/read`, {}).catch(()=>{});
  };

  const markAllNotifsRead = () => {
    setState(s => ({
      ...s, notifications: s.notifications.map(n => ({ ...n, read:true }))
    }));
    api.patch('/api/notifications/read-all', {}).catch(()=>{});
  };

  // Bookings/messages/reviews were moved off local mock state onto their
  // own pages, which call the real API directly (see Sessions/
  // SessionDetail, Messages, Reviews). Wallet *balance* stays here since
  // it's shown in a few places at once (Wallet, Checkout, Navbar) — this
  // re-pulls the authoritative value from the backend after anything that
  // could have changed it (a real Razorpay top-up, a paid booking, a
  // cancellation refund).
  const refreshWallet = async () => {
    try{
      const data = await api.get('/api/wallet');
      setState(s => ({ ...s, wallet: { balance: data.wallet?.balance ?? s.wallet.balance } }));
    }catch{
      // best-effort — whatever's already in state stays
    }
  };

  const updateSettings = (patch) => setState(s => ({ ...s, settings:{ ...s.settings, ...patch } }));

  const toggleConnectedAccount = (provider) => setState(s => ({
    ...s, settings:{ ...s.settings, [`connected${provider}`]: !s.settings[`connected${provider}`] }
  }));

  const value = {
    ...state,
    liveConnected,
    authLoading,
    signUp, logIn, logInWithGoogle, logInWithFacebook, verifyEmail: verifyEmailOtp, resendOtp,
    requestPasswordReset, confirmPasswordReset,
    completeOnboarding, logOut,
    updateProfile, uploadAvatar, removeAvatar, enroll, markLessonComplete, recordQuizScore, toggleWishlist,
    toggleSavedLesson, isLessonSaved, setLastWatched,
    markNotifRead, markAllNotifsRead,
    refreshWallet,
    updateSettings, toggleConnectedAccount, changePassword, deleteAccount
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(){
  const ctx = useContext(UserContext);
  if(!ctx) throw new Error('useUser must be used inside <UserProvider>');
  return ctx;
}
