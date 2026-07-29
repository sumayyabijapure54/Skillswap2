import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setTokens, clearTokens } from '../lib/api.js';

const UserContext = createContext(null);
const STORAGE_KEY = 'skillswap_user_v1';

// Maps a backend User document (see server/src/models/User.js) onto the
// slice of local state that's now server-driven. Everything else in
// state (notifications, messages, bookings, wallet transactions, etc.)
// is still local-only mock data — see the README note on what's wired up.
function userToProfileState(user) {
  return {
    authed: true,
    verified: !!user.verified,
    onboarded: !!user.onboarded,
    isAdmin: !!user.isAdmin,
    profile: {
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
    wallet: { balance: user.wallet?.balance ?? 0 }
  };
}

const SEED_NOTIFICATIONS = [
  { id:1, type:'booking', text:'Your session "UI/UX Design Workshop" with Sarah Williams is confirmed for tomorrow.', time:'2h ago', read:false },
  { id:2, type:'message', text:'Alex Johnson replied to your question in React Fundamentals.', time:'5h ago', read:false },
  { id:3, type:'recommendation', text:'New skill match: "SEO & Growth Marketing" fits what you\'ve been learning.', time:'1d ago', read:false },
  { id:4, type:'system', text:'Welcome to SkillSwap! Complete your profile to get better matches.', time:'3d ago', read:true }
];

// Stands in for a real-time channel (Socket.IO/WebSocket) pushing events
// from a backend. The interval below simulates that push — swapping it for
// a real `socket.on('notification', ...)` listener later doesn't change
// anything downstream, since it lands through the same `notifications`
// state and `markNotifRead`/`markAllNotifsRead` actions.
const LIVE_NOTIF_POOL = [
  { type:'message', text:'Sarah Williams sent you a new message.' },
  { type:'booking', text:'A mentor just accepted your session request.' },
  { type:'recommendation', text:'New skill match found based on your recent activity.' },
  { type:'system', text:'Someone in the community replied to your post.' },
  { type:'booking', text:'Reminder: you have a session starting soon.' }
];

const SEED_CONVERSATIONS = [
  {
    id: 'c-alex-johnson', mentorId: 'alex-johnson',
    messages: [
      { id:1, from:'them', text:"Hey! Saw you started React Fundamentals — happy to help if you get stuck on hooks.", time:'Yesterday' },
      { id:2, from:'me', text:"That'd be great, thank you! I'm a little lost on useEffect dependency arrays.", time:'Yesterday' },
      { id:3, from:'them', text:"Totally normal to trip on that one. Want to book a quick session and I'll walk through it live?", time:'10:14 AM' }
    ]
  },
  {
    id: 'c-sarah-williams', mentorId: 'sarah-williams',
    messages: [
      { id:1, from:'them', text:"Looking forward to our Figma components session — bring a design you're working on if you have one!", time:'2 days ago' }
    ]
  }
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
    profile: { name:'', email:'', bio:'', avatar:'', role:null, interests:[], goal:null, skillsOffered:[], skillsWanted:[] },
    enrolled: [],      // [{ skillId, completedLessons:[lessonId,...], enrolledAt, quizScores:{lessonId:{score,total}} }]
    wishlist: [],       // [skillId, ...]
    notifications: SEED_NOTIFICATIONS,
    conversations: SEED_CONVERSATIONS,   // [{ id, mentorId, messages:[{id,from,text,time}] }]
    bookings: [],          // [{ id, mentorId, skillId, day, time, sessionType, price, status, paid, createdAt, notes }]
    reviews: [],            // [{ id, mentorId, skillId, bookingId, rating, text, createdAt }]
    savedLessons: [],  // [{ skillId, videoId, title, thumbnail, channelTitle, savedAt }]
    lastWatched: {},   // { [skillId]: { videoId, lessonIndex, updatedAt } }
    wallet: { balance: 50 },
    transactions: [
      { id:'tx-seed-1', type:'topup', amount:50, method:'card', description:'Welcome bonus credit', createdAt: daysAgo(10) }
    ],
    settings: { emailNotifs:true, pushNotifs:true, smsNotifs:false, connectedGoogle:false, connectedGithub:false }
  };
}

function daysAgo(n){
  const d = new Date();
  d.setDate(d.getDate()-n);
  return d.toISOString();
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

  // Simulated real-time notification stream — only "connects" once the
  // member is signed in, same as a real socket would only subscribe post-auth.
  useEffect(()=>{
    if(!state.authed) { setLiveConnected(false); return; }
    setLiveConnected(true);
    const interval = setInterval(()=>{
      if(Math.random() > 0.45) return; // not every tick — feels organic, not spammy
      const template = LIVE_NOTIF_POOL[Math.floor(Math.random()*LIVE_NOTIF_POOL.length)];
      setState(s => ({
        ...s,
        notifications: [
          { id: Date.now(), type: template.type, text: template.text, time: 'Just now', read: false },
          ...s.notifications
        ].slice(0, 30)
      }));
    }, 40000);
    return () => clearInterval(interval);
  }, [state.authed]);

  // --- real auth/profile actions, backed by the Express API (server/) ---

  const signUp = async ({ name, email, password }) => {
    try{
      const data = await api.post('/api/auth/signup', { name, email, password });
      setTokens(data);
      setState(s => ({ ...s, ...userToProfileState(data.user) }));
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
      return { ok:true, verified: !!data.user.verified, onboarded: !!data.user.onboarded };
    }catch(err){
      return { ok:false, error: err.message };
    }
  };

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

  const enroll = (skillId) => setState(s => {
    if(s.enrolled.some(e=>e.skillId===skillId)) return s;
    return { ...s, enrolled:[...s.enrolled, { skillId, completedLessons:[], enrolledAt:new Date().toISOString() }] };
  });

  const markLessonComplete = (skillId, lessonId) => setState(s => ({
    ...s,
    enrolled: s.enrolled.some(e=>e.skillId===skillId)
      ? s.enrolled.map(e => e.skillId===skillId && !e.completedLessons.includes(lessonId)
          ? { ...e, completedLessons:[...e.completedLessons, lessonId] }
          : e)
      : [...s.enrolled, { skillId, completedLessons:[lessonId], enrolledAt:new Date().toISOString() }]
  }));

  const recordQuizScore = (skillId, lessonId, score, total) => setState(s => ({
    ...s,
    enrolled: s.enrolled.map(e => e.skillId===skillId
      ? { ...e, quizScores: { ...(e.quizScores||{}), [lessonId]: { score, total } } }
      : e)
  }));

  const toggleWishlist = (skillId) => setState(s => ({
    ...s,
    wishlist: s.wishlist.includes(skillId) ? s.wishlist.filter(id=>id!==skillId) : [...s.wishlist, skillId]
  }));

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

  const markNotifRead = (id) => setState(s => ({
    ...s, notifications: s.notifications.map(n => n.id===id ? { ...n, read:true } : n)
  }));

  const markAllNotifsRead = () => setState(s => ({
    ...s, notifications: s.notifications.map(n => ({ ...n, read:true }))
  }));

  const getOrCreateConversation = (mentorId) => {
    let convo = state.conversations.find(c=>c.mentorId===mentorId);
    if(!convo){
      convo = { id:`c-${mentorId}-${Date.now()}`, mentorId, messages:[] };
      setState(s => ({ ...s, conversations:[...s.conversations, convo] }));
    }
    return convo;
  };

  const sendMessage = (conversationId, text) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
    setState(s => ({
      ...s,
      conversations: s.conversations.map(c => c.id===conversationId
        ? { ...c, messages:[...c.messages, { id:c.messages.length+1, from:'me', text, time }] }
        : c)
    }));
  };

  const bookSession = ({ mentorId, skillId, day, time, sessionType }) => {
    const id = `bk-${Date.now()}`;
    setState(s => ({
      ...s,
      bookings: [...s.bookings, { id, mentorId, skillId, day, time, sessionType, status:'upcoming', createdAt:new Date().toISOString(), notes:'' }],
      notifications: [
        { id: Date.now(), type:'booking', text:`Your ${sessionType} session is booked for ${day} at ${time}.`, time:'Just now', read:false },
        ...s.notifications
      ]
    }));
    return id;
  };

  // Checkout flow: books the session AND records the payment in one atomic
  // action, so a booking can never exist in an unpaid state. Returns
  // { ok:false, error } if a wallet payment can't cover the price.
  const payAndBookSession = ({ mentorId, skillId, day, time, sessionType, price, method }) => {
    if(method === 'wallet' && state.wallet.balance < price){
      return { ok:false, error:'Insufficient wallet balance.' };
    }
    const bookingId = `bk-${Date.now()}`;
    const txId = `tx-${Date.now()}`;
    setState(s => ({
      ...s,
      bookings: [...s.bookings, { id:bookingId, mentorId, skillId, day, time, sessionType, price, status:'upcoming', paid:true, createdAt:new Date().toISOString(), notes:'' }],
      wallet: method==='wallet' ? { ...s.wallet, balance: +(s.wallet.balance - price).toFixed(2) } : s.wallet,
      transactions: [
        { id:txId, type:'session_payment', amount:-price, method, description:`${sessionType} session booking`, bookingId, createdAt:new Date().toISOString() },
        ...s.transactions
      ],
      notifications: [
        { id: Date.now(), type:'booking', text:`Your ${sessionType} session is booked for ${day} at ${time}.`, time:'Just now', read:false },
        ...s.notifications
      ]
    }));
    return { ok:true, bookingId };
  };

  const topUpWallet = (amount, method='card') => {
    const txId = `tx-${Date.now()}`;
    setState(s => ({
      ...s,
      wallet: { ...s.wallet, balance: +(s.wallet.balance + amount).toFixed(2) },
      transactions: [
        { id:txId, type:'topup', amount, method, description:'Wallet top-up', createdAt:new Date().toISOString() },
        ...s.transactions
      ]
    }));
  };

  // Called after the backend verifies a real Razorpay payment. The server
  // is the source of truth for the new balance and the transaction record
  // (never trust a client-computed amount) — this just mirrors that
  // confirmed result into local state so the rest of the app (which reads
  // wallet/transactions from here) reflects it immediately.
  const syncWalletFromPayment = ({ balance, transaction }) => setState(s => ({
    ...s,
    wallet: { ...s.wallet, balance },
    transactions: [transaction, ...s.transactions]
  }));

  const cancelBooking = (id) => setState(s => {
    const booking = s.bookings.find(b=>b.id===id);
    const shouldRefund = booking && booking.paid && booking.status==='upcoming';
    return {
      ...s,
      bookings: s.bookings.map(b => b.id===id ? { ...b, status:'cancelled' } : b),
      wallet: shouldRefund ? { ...s.wallet, balance: +(s.wallet.balance + booking.price).toFixed(2) } : s.wallet,
      transactions: shouldRefund ? [
        { id:`tx-${Date.now()}`, type:'refund', amount:booking.price, method:'wallet', description:`Refund for cancelled ${booking.sessionType} session`, bookingId:id, createdAt:new Date().toISOString() },
        ...s.transactions
      ] : s.transactions
    };
  });

  const updateBookingNotes = (id, notes) => setState(s => ({
    ...s, bookings: s.bookings.map(b => b.id===id ? { ...b, notes } : b)
  }));

  const markBookingCompleted = (id) => setState(s => ({
    ...s, bookings: s.bookings.map(b => b.id===id ? { ...b, status:'completed' } : b)
  }));

  const addReview = ({ mentorId, skillId, bookingId, rating, text }) => {
    const id = `rv-${Date.now()}`;
    setState(s => ({
      ...s,
      reviews: [...s.reviews, { id, mentorId, skillId, bookingId, rating, text, createdAt:new Date().toISOString() }],
      bookings: bookingId ? s.bookings.map(b => b.id===bookingId ? { ...b, status:'reviewed' } : b) : s.bookings
    }));
    return id;
  };

  const updateSettings = (patch) => setState(s => ({ ...s, settings:{ ...s.settings, ...patch } }));

  const toggleConnectedAccount = (provider) => setState(s => ({
    ...s, settings:{ ...s.settings, [`connected${provider}`]: !s.settings[`connected${provider}`] }
  }));

  const value = {
    ...state,
    liveConnected,
    authLoading,
    signUp, logIn, verifyEmail: verifyEmailOtp, resendOtp,
    requestPasswordReset, confirmPasswordReset,
    completeOnboarding, logOut,
    updateProfile, enroll, markLessonComplete, recordQuizScore, toggleWishlist,
    toggleSavedLesson, isLessonSaved, setLastWatched,
    markNotifRead, markAllNotifsRead,
    getOrCreateConversation, sendMessage,
    bookSession, payAndBookSession, cancelBooking, updateBookingNotes, markBookingCompleted, addReview,
    topUpWallet,
    syncWalletFromPayment,
    updateSettings, toggleConnectedAccount, changePassword, deleteAccount
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(){
  const ctx = useContext(UserContext);
  if(!ctx) throw new Error('useUser must be used inside <UserProvider>');
  return ctx;
}
