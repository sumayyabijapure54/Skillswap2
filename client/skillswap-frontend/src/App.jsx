import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import BackgroundFX from './components/BackgroundFX.jsx';
import RequireAuth from './components/RequireAuth.jsx';

import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import SkillDetail from './pages/SkillDetail.jsx';
import LessonPlayer from './pages/LessonPlayer.jsx';
import Legal from './pages/Legal.jsx';
import Help from './pages/Help.jsx';
import SignUp from './pages/SignUp.jsx';
import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MyLearning from './pages/MyLearning.jsx';
import LearningHistory from './pages/LearningHistory.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Profile from './pages/Profile.jsx';
import Notifications from './pages/Notifications.jsx';
import MentorProfile from './pages/MentorProfile.jsx';
import PostSkill from './pages/PostSkill.jsx';
import Community from './pages/Community.jsx';
import Messages from './pages/Messages.jsx';
import BookSession from './pages/BookSession.jsx';
import SessionBooking from './pages/SessionBooking.jsx';
import Sessions from './pages/Sessions.jsx';
import SessionDetail from './pages/SessionDetail.jsx';
import Reviews from './pages/Reviews.jsx';
import ComingSoon from './pages/ComingSoon.jsx';

// Auth/onboarding/dashboard screens use full-height layouts of their own
// (see .auth-shell / .onboard-shell / .dash-shell) — the marketing footer
// doesn't belong there.
const NO_FOOTER_EXACT = [
  '/signup', '/login', '/forgot-password', '/reset-password', '/verify-email', '/onboarding',
  '/dashboard', '/my-learning', '/learning-history', '/wishlist', '/profile', '/notifications',
  '/post-skill', '/community', '/messages', '/book-session', '/sessions', '/reviews'
];
const NO_FOOTER_PREFIXES = ['/book/', '/session/'];

export default function App(){
  const { pathname } = useLocation();

  React.useEffect(()=>{ window.scrollTo(0,0); }, [pathname]);

  const showFooter = !NO_FOOTER_EXACT.includes(pathname) && !NO_FOOTER_PREFIXES.some(p=>pathname.startsWith(p));

  return (
    <div className="page">
      <BackgroundFX />
      <div className="grain"></div>
      <div className="bg-glow"></div>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/skill/:id" element={<SkillDetail />} />
        <Route path="/learn/:id" element={<LessonPlayer />} />
        <Route path="/mentor/:id" element={<MentorProfile />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/help" element={<Help />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/onboarding" element={<Onboarding />} />

        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/my-learning" element={<RequireAuth><MyLearning /></RequireAuth>} />
        <Route path="/learning-history" element={<RequireAuth><LearningHistory /></RequireAuth>} />
        <Route path="/wishlist" element={<RequireAuth><Wishlist /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
        <Route path="/post-skill" element={<RequireAuth><PostSkill /></RequireAuth>} />
        <Route path="/community" element={<RequireAuth><Community /></RequireAuth>} />
        <Route path="/messages" element={<RequireAuth><Messages /></RequireAuth>} />
        <Route path="/book-session" element={<RequireAuth><BookSession /></RequireAuth>} />
        <Route path="/book/:mentorId" element={<RequireAuth><SessionBooking /></RequireAuth>} />
        <Route path="/sessions" element={<RequireAuth><Sessions /></RequireAuth>} />
        <Route path="/session/:id" element={<RequireAuth><SessionDetail /></RequireAuth>} />
        <Route path="/reviews" element={<RequireAuth><Reviews /></RequireAuth>} />

        <Route path="*" element={<ComingSoon />} />
      </Routes>

      {showFooter && <Footer />}
    </div>
  );
}
