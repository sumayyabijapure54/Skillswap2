import React from 'react';

// Single source of truth for the SkillSwap brand mark. The icon itself
// (dark ink + mint swirl) is self-contained — it reads fine on both the
// light and dark navbar/footer backgrounds, so there's no separate
// light/dark asset to swap; only surrounding text colors follow the theme
// via CSS variables.
export default function Logo({ withText = true, size = 38, tagline = null, className = '' }) {
  return (
    <span className={`logo-lockup ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <img
        src="/logo.svg"
        alt="SkillSwap"
        width={size}
        height={size}
        style={{ display: 'block', flexShrink: 0 }}
      />
      {withText && (
        <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span className="logo-word">
            Skill<span className="logo-word-accent">Swap</span>
          </span>
          {tagline && <span className="logo-tag">{tagline}</span>}
        </span>
      )}
    </span>
  );
}
