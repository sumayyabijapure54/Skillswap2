import React from 'react';
import Logo from './Logo.jsx';

const VISUALS = {
  signup: {
    badge: '✦ Join 25,000+ learners',
    heading: <>Start swapping<br /><span className="g">skills today.</span></>,
    text: 'Create a free account to save your progress, book mentors, and post the skills you can teach.',
  },
  login: {
    badge: '✦ Welcome back',
    heading: <>Pick up right<br /><span className="g">where you left off.</span></>,
    text: 'Log in to see your saved skills, upcoming sessions, and personalized recommendations.',
  },
  forgot: {
    badge: '✦ Account recovery',
    heading: <>It happens to<br /><span className="g">everyone.</span></>,
    text: "Enter the email on your account and we'll send you a link to get back in.",
  },
  verify: {
    badge: '✦ Almost there',
    heading: <>One quick<br /><span className="g">check.</span></>,
    text: 'Confirming your email keeps bookings, messages, and reviews trustworthy for the whole community.',
  }
};

export default function AuthLayout({ variant = 'signup', children }){
  const v = VISUALS[variant] || VISUALS.signup;

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <Logo withText={false} size={44} className="auth-visual-logo" />
        <div className="badge">{v.badge}</div>
        <h2>{v.heading}</h2>
        <p>{v.text}</p>

        <div className="auth-stat-row">
          <div><b>25K+</b><span>Active members</span></div>
          <div><b>1,200+</b><span>Skills available</span></div>
          <div><b>4.9★</b><span>Average rating</span></div>
        </div>

        <div className="quote">
          <p>"SkillSwap helped me learn React in just 2 weeks! The community is amazing and so supportive."</p>
          <div className="who"><span>Rohan Mehta</span><span>★★★★★</span></div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">{children}</div>
      </div>
    </div>
  );
}
