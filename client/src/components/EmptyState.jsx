import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal.jsx';

// A calm, on-brand "nothing here yet" state — built on the existing
// .dash-empty panel so it fits pages that already use it, but adds an
// icon, a real heading, and an optional CTA so an empty list reads as
// an invitation ("browse skills →") rather than a dead end.
export default function EmptyState({ icon = '✦', title, text, ctaLabel, ctaTo, ctaOnClick }) {
  return (
    <ScrollReveal className="dash-empty" style={{ padding: '48px 32px' }}>
      <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.85 }}>{icon}</div>
      {title && <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 15.5, marginBottom: 6 }}>{title}</div>}
      {text && <div style={{ maxWidth: 360, margin: '0 auto' }}>{text}</div>}
      {(ctaLabel && (ctaTo || ctaOnClick)) && (
        ctaTo
          ? <Link to={ctaTo} className="btn-solid" style={{ marginTop: 18, display: 'inline-block' }}>{ctaLabel}</Link>
          : <button className="btn-solid" onClick={ctaOnClick} style={{ marginTop: 18 }}>{ctaLabel}</button>
      )}
    </ScrollReveal>
  );
}
