import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import BackgroundFX from './components/BackgroundFX.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import RippleEffect from './components/RippleEffect.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import AiMentorWidget from './components/AiMentorWidget.jsx';
import CertificateToast from './components/CertificateToast.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { useUser } from './context/UserContext.jsx';
import { useToast } from './context/ToastContext.jsx';
import { initSmoothScroll, scrollToTop } from './lib/smoothScroll.js';
import { ScrollTrigger } from './lib/gsap.js';

// Home loads eagerly (it's the first paint for most visits — no reason to
// add a chunk round-trip to the landing page). Every other route is its
// own lazy chunk: the browser only ever downloads the page the person is
// actually navigating to, instead of all ~55 pages up front. See the
// <Suspense fallback> below for what shows while a chunk downloads.
import Home from './pages/Home.jsx';
const Explore = lazy(() => import('./pages/Explore.jsx'));
const SkillDetail = lazy(() => import('./pages/SkillDetail.jsx'));
const LessonPlayer = lazy(() => import('./pages/LessonPlayer.jsx'));
const CourseQuiz = lazy(() => import('./pages/CourseQuiz.jsx'));
const Legal = lazy(() => import('./pages/Legal.jsx'));
const Help = lazy(() => import('./pages/Help.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Pricing = lazy(() => import('./pages/Pricing.jsx'));
const Search = lazy(() => import('./pages/Search.jsx'));
const SignUp = lazy(() => import('./pages/SignUp.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail.jsx'));
const Onboarding = lazy(() => import('./pages/Onboarding.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const MyLearning = lazy(() => import('./pages/MyLearning.jsx'));
const LearningHistory = lazy(() => import('./pages/LearningHistory.jsx'));
const Wishlist = lazy(() => import('./pages/Wishlist.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Notifications = lazy(() => import('./pages/Notifications.jsx'));
const MentorProfile = lazy(() => import('./pages/MentorProfile.jsx'));
const PostSkill = lazy(() => import('./pages/PostSkill.jsx'));
const Community = lazy(() => import('./pages/Community.jsx'));
const Messages = lazy(() => import('./pages/Messages.jsx'));
const BookSession = lazy(() => import('./pages/BookSession.jsx'));
const SessionBooking = lazy(() => import('./pages/SessionBooking.jsx'));
const Sessions = lazy(() => import('./pages/Sessions.jsx'));
const SessionDetail = lazy(() => import('./pages/SessionDetail.jsx'));
const LiveSessions = lazy(() => import('./pages/LiveSessions.jsx'));
const LiveSessionDetail = lazy(() => import('./pages/LiveSessionDetail.jsx'));
const Reviews = lazy(() => import('./pages/Reviews.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const Wallet = lazy(() => import('./pages/Wallet.jsx'));
const PaymentHistory = lazy(() => import('./pages/PaymentHistory.jsx'));
const Certificates = lazy(() => import('./pages/Certificates.jsx'));
const CertificateDetail = lazy(() => import('./pages/CertificateDetail.jsx'));
const CertificateVerify = lazy(() => import('./pages/CertificateVerify.jsx'));
const PublicProfile = lazy(() => import('./pages/PublicProfile.jsx'));
const MentorDashboard = lazy(() => import('./pages/MentorDashboard.jsx'));
const MentorCourses = lazy(() => import('./pages/MentorCourses.jsx'));
const MentorCourseForm = lazy(() => import('./pages/MentorCourseForm.jsx'));
const MentorQuizManager = lazy(() => import('./pages/MentorQuizManager.jsx'));
const MentorStudents = lazy(() => import('./pages/MentorStudents.jsx'));
const MentorAnalytics = lazy(() => import('./pages/MentorAnalytics.jsx'));
const Recommendations = lazy(() => import('./pages/Recommendations.jsx'));
const Achievements = lazy(() => import('./pages/Achievements.jsx'));
const AccountSettings = lazy(() => import('./pages/AccountSettings.jsx'));
const AiMentor = lazy(() => import('./pages/AiMentor.jsx'));
import RequireAdmin from './components/RequireAdmin.jsx';
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview.jsx'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers.jsx'));
const AdminMentorApplications = lazy(() => import('./pages/admin/AdminMentorApplications.jsx'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports.jsx'));
const ComingSoon = lazy(() => import('./pages/ComingSoon.jsx'));

// Auth/onboarding/dashboard screens use full-height layouts of their own
// (see .auth-shell / .onboard-shell / .dash-shell) — the marketing footer
// doesn't belong there.
const NO_FOOTER_EXACT = [
  '/signup', '/login', '/forgot-password', '/reset-password', '/verify-email', '/onboarding',
  '/dashboard', '/my-learning', '/learning-history', '/wishlist', '/profile', '/notifications',
  '/post-skill', '/community', '/messages', '/book-session', '/sessions', '/live-sessions', '/reviews',
  '/checkout', '/wallet', '/payments', '/certificates', '/mentor-dashboard', '/recommendations', '/achievements',
  '/account-settings', '/mentor-courses', '/mentor-courses/new', '/mentor-students', '/mentor-analytics'
];
const NO_FOOTER_PREFIXES = ['/book/', '/session/', '/live-sessions/', '/certificate/', '/admin', '/mentor-courses/'];

export default function App(){
  const { pathname } = useLocation();
  const { authed } = useUser();
  const toast = useToast();

  React.useEffect(()=>{
    const onSessionExpired = () => toast.error("You've been signed out — please log in again.");
    window.addEventListener('skillswap:session-expired', onSessionExpired);
    return () => window.removeEventListener('skillswap:session-expired', onSessionExpired);
  }, [toast]);

  React.useEffect(()=>{ initSmoothScroll(); }, []);

  React.useEffect(()=>{
    scrollToTop();
    // Route content mounts after this effect fires, so give layout a tick
    // to settle before ScrollTrigger recalculates trigger positions.
    const id = requestAnimationFrame(()=> ScrollTrigger.refresh());
    return ()=> cancelAnimationFrame(id);
  }, [pathname]);

  // A single next-frame refresh (above) is enough for route changes, but on
  // the very first load there's more still settling below the fold — web
  // fonts swapping in, images, the marquee/testimonial carousel — each of
  // which shifts document height after ScrollTrigger already measured it.
  // Re-running refresh once those actually finish keeps every trigger's
  // bounds (including the hero parallax) accurate instead of stale.
  React.useEffect(()=>{
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  const showFooter = !NO_FOOTER_EXACT.includes(pathname) && !NO_FOOTER_PREFIXES.some(p=>pathname.startsWith(p));
  // Utility/app pages (dashboard, forms, tables, checkout, live calls) reuse
  // the same routing signal as showFooter — they're "in the app", not "on
  // the site". Keeping the always-animating 3D particle field off those
  // pages cuts unnecessary GPU/CPU work and stops the effect stack from
  // competing with dense data or focused tasks. The cheap CSS .bg-glow
  // still runs everywhere for ambient warmth.
  const showBackgroundFX = showFooter;

  return (
    <div className="page">
      {showBackgroundFX && <BackgroundFX />}
      <div className="grain"></div>
      <div className="bg-glow"></div>

      <Navbar />
      <CustomCursor />
      <RippleEffect />

      <div className="route-fade" key={pathname}>
        <ErrorBoundary resetKey={pathname}>
        <Suspense fallback={<div className="route-loader"><div className="route-loader-spin" /></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/skill/:id" element={<SkillDetail />} />
          <Route path="/learn/:id" element={<LessonPlayer />} />
          <Route path="/learn/:id/quiz" element={<RequireAuth><CourseQuiz /></RequireAuth>} />
          <Route path="/mentor/:id" element={<MentorProfile />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/help" element={<Help />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/search" element={<Search />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/verify" element={<CertificateVerify />} />
          <Route path="/verify/:certificateNumber" element={<CertificateVerify />} />
          <Route path="/u/:userId" element={<PublicProfile />} />

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
          <Route path="/book/:skillId" element={<RequireAuth><SessionBooking /></RequireAuth>} />
          <Route path="/sessions" element={<RequireAuth><Sessions /></RequireAuth>} />
          <Route path="/session/:id" element={<RequireAuth><SessionDetail /></RequireAuth>} />
          <Route path="/live-sessions" element={<RequireAuth><LiveSessions /></RequireAuth>} />
          <Route path="/live-sessions/:id" element={<RequireAuth><LiveSessionDetail /></RequireAuth>} />
          <Route path="/reviews" element={<RequireAuth><Reviews /></RequireAuth>} />
          <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="/wallet" element={<RequireAuth><Wallet /></RequireAuth>} />
          <Route path="/payments" element={<RequireAuth><PaymentHistory /></RequireAuth>} />
          <Route path="/certificates" element={<RequireAuth><Certificates /></RequireAuth>} />
          <Route path="/certificate/:skillId" element={<RequireAuth><CertificateDetail /></RequireAuth>} />
          <Route path="/mentor-dashboard" element={<RequireAuth><MentorDashboard /></RequireAuth>} />
          <Route path="/mentor-courses" element={<RequireAuth><MentorCourses /></RequireAuth>} />
          <Route path="/mentor-courses/new" element={<RequireAuth><MentorCourseForm /></RequireAuth>} />
          <Route path="/mentor-courses/:id/edit" element={<RequireAuth><MentorCourseForm /></RequireAuth>} />
          <Route path="/mentor-courses/:id/quiz" element={<RequireAuth><MentorQuizManager /></RequireAuth>} />
          <Route path="/mentor-students" element={<RequireAuth><MentorStudents /></RequireAuth>} />
          <Route path="/mentor-analytics" element={<RequireAuth><MentorAnalytics /></RequireAuth>} />
          <Route path="/recommendations" element={<RequireAuth><Recommendations /></RequireAuth>} />
          <Route path="/achievements" element={<RequireAuth><Achievements /></RequireAuth>} />
          <Route path="/account-settings" element={<RequireAuth><AccountSettings /></RequireAuth>} />
          <Route path="/ai-mentor" element={<RequireAuth><AiMentor /></RequireAuth>} />

          <Route path="/admin" element={<RequireAdmin><AdminOverview /></RequireAdmin>} />
          <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
          <Route path="/admin/mentor-applications" element={<RequireAdmin><AdminMentorApplications /></RequireAdmin>} />
          <Route path="/admin/reports" element={<RequireAdmin><AdminReports /></RequireAdmin>} />

          <Route path="*" element={<ComingSoon />} />
        </Routes>
        </Suspense>
        </ErrorBoundary>
      </div>

      {showFooter && <Footer />}

      {/* Also hidden on /learn/:id/quiz — the fixed bottom-left bubble can
          sit directly over the quiz's answer options / Previous button on
          short viewports (e.g. keyboard open, older/smaller phones),
          blocking taps. Confirmed via mobile-viewport screenshot testing. */}
      {authed && pathname !== '/ai-mentor' && !/^\/learn\/[^/]+\/quiz$/.test(pathname) && <AiMentorWidget />}
      {authed && <CertificateToast />}
    </div>
  );
}
