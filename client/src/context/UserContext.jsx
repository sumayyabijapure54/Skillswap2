import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext(null);
const STORAGE_KEY = 'skillswap_user_v1';

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
    profile: { name:'', email:'', bio:'', avatar:'', role:null, skillsOffered:[], skillsWanted:[] },
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

  useEffect(()=>{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

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

  // --- mock actions — the same shapes a real /api/auth + /api/users backend
  // would return, so swapping to real fetch calls later is mechanical. ---

  const signUp = ({ name, email }) => {
    setState(s => ({ ...s, authed:true, verified:false, onboarded:false, profile:{ ...s.profile, name, email } }));
  };

  const logIn = ({ email }) => {
    setState(s => {
      const known = s.profile.email === email;
      return {
        ...s,
        authed: true, verified: true, onboarded: known ? s.onboarded : true,
        profile: known ? s.profile : { ...s.profile, name: email.split('@')[0].replace(/[._]/g,' '), email, role:'learner' }
      };
    });
  };

  const verifyEmail = () => setState(s => ({ ...s, verified:true }));

  const completeOnboarding = ({ role, interests, goal }) => {
    setState(s => ({ ...s, onboarded:true, profile:{ ...s.profile, role, interests, goal } }));
  };

  const logOut = () => setState(emptyState());

  const updateProfile = (patch) => setState(s => ({ ...s, profile:{ ...s.profile, ...patch } }));

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

  const toggleSavedLesson = (skillId, video) => setState(s => {
    const exists = s.savedLessons.some(l => l.skillId===skillId && l.videoId===video.id);
    return {
      ...s,
      savedLessons: exists
        ? s.savedLessons.filter(l => !(l.skillId===skillId && l.videoId===video.id))
        : [...s.savedLessons, {
            skillId, videoId: video.id, title: video.title,
            thumbnail: video.thumbnail, channelTitle: video.channelTitle,
            savedAt: new Date().toISOString()
          }]
    };
  });

  const isLessonSaved = (skillId, videoId) =>
    state.savedLessons.some(l => l.skillId===skillId && l.videoId===videoId);

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

  const changePassword = () => Promise.resolve({ ok:true });

  const deleteAccount = () => setState(emptyState());

  const value = {
    ...state,
    liveConnected,
    signUp, logIn, verifyEmail, completeOnboarding, logOut,
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
