import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function ComingSoon({ title, text }){
  const { pathname } = useLocation();

  return (
    <div className="coming-soon">
      <div className="tag-icon">🚧</div>
      <h1>{title || 'Coming in a later phase'}</h1>
      <p>
        {text || (
          <>This page (<code style={{color:'var(--accent)'}}>{pathname}</code>) is part of a later build phase in the SkillSwap information architecture — Phases 1–2 cover Home, Explore, Skill Detail, Lesson Player, Legal, Help Center, and the full Sign Up / Log In / Password Recovery / Email Verification / Onboarding flow.</>
        )}
      </p>
      <div className="cta-row">
        <Link to="/" className="btn-primary-lg">Back to Home</Link>
        <Link to="/explore" className="btn-ghost-lg">Browse Skills</Link>
      </div>
    </div>
  );
}
