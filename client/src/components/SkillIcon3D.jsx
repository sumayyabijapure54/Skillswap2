import React from 'react';

/**
 * SkillIcon3D — a coded (not image-based) "glass gem" 3D badge for each
 * skill category. Built to sit inside .explore-card only, so it never
 * touches any other card style on the site.
 *
 * Design language:
 *  - a rounded glass tile with a category-specific gradient
 *  - a soft top-left gloss highlight (glass sheen)
 *  - a blurred color-matched shadow beneath it (reads as "floating")
 *  - a minimal line-glyph on top, lifted with a drop shadow for depth
 * Each category gets its own hue pair so the grid reads as varied and
 * alive, while every tile shares the same construction so it stays
 * cohesive with the dark, glow-accented theme already in use.
 */

const RECIPES = {
  'programming':          { from: '#38BDF8', to: '#6366F1', glow: 'rgba(99,102,241,0.45)' },
  'ai-ml':                { from: '#B37BFF', to: '#FF6BCB', glow: 'rgba(255,107,203,0.4)'  },
  'web-development':      { from: '#14F0B4', to: '#22D3EE', glow: 'rgba(20,240,180,0.45)'  },
  'mobile-development':   { from: '#FFB25A', to: '#FF7A45', glow: 'rgba(255,122,69,0.4)'   },
  'design':               { from: '#C084FC', to: '#F472B6', glow: 'rgba(196,132,252,0.4)'  },
  'graphic-design':       { from: '#FB7185', to: '#FBBF24', glow: 'rgba(251,113,133,0.4)'  },
  'video-editing':        { from: '#F87171', to: '#FB923C', glow: 'rgba(248,113,113,0.4)'  },
  'marketing':            { from: '#FBBF24', to: '#F97316', glow: 'rgba(251,191,36,0.4)'   },
  'business':             { from: '#60A5FA', to: '#6366F1', glow: 'rgba(96,165,250,0.4)'   },
  'finance':              { from: '#34D399', to: '#14F0B4', glow: 'rgba(52,211,153,0.4)'   },
  'languages':            { from: '#22D3EE', to: '#3B82F6', glow: 'rgba(34,211,238,0.4)'   },
  'music':                { from: '#C084FC', to: '#9B7BFF', glow: 'rgba(155,123,255,0.4)'  },
  'photography':          { from: '#F472B6', to: '#A78BFA', glow: 'rgba(244,114,182,0.4)'  },
  'cooking':              { from: '#FBBF24', to: '#F87171', glow: 'rgba(251,191,36,0.4)'   },
  'fitness':              { from: '#FB7185', to: '#F472B6', glow: 'rgba(251,113,133,0.4)'  },
};

const DEFAULT_RECIPE = { from: '#14F0B4', to: '#9B7BFF', glow: 'rgba(20,240,180,0.4)' };

const glyphProps = {
  fill: 'none',
  stroke: 'rgba(255,255,255,0.96)',
  strokeWidth: 3.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function Glyph({ category }) {
  switch (category) {
    case 'programming':
      return <path {...glyphProps} d="M29 26 L19 34 L29 42 M45 26 L55 34 L45 42" />;
    case 'ai-ml':
      return (
        <g {...glyphProps}>
          <rect x="27" y="27" width="20" height="14" rx="3" />
          <circle cx="37" cy="34" r="2.6" fill="rgba(255,255,255,0.96)" stroke="none" />
          <path d="M31 27 V22 M43 27 V22 M31 41 V46 M43 41 V46 M27 31 H22 M27 37 H22 M47 31 H52 M47 37 H52" />
        </g>
      );
    case 'web-development':
      return (
        <g {...glyphProps}>
          <rect x="22" y="24" width="30" height="20" rx="2.5" />
          <path d="M30 48 H44 M37 44 V48" />
        </g>
      );
    case 'mobile-development':
      return (
        <g {...glyphProps}>
          <rect x="29" y="20" width="16" height="28" rx="3.5" />
          <path d="M35.5 43.5 H38.5" />
        </g>
      );
    case 'design':
      return (
        <g {...glyphProps}>
          <path d="M25 47 L30 46 L47 29 L42 24 L25 41 Z" />
          <path d="M42 24 L47 29" />
        </g>
      );
    case 'graphic-design':
      return (
        <g {...glyphProps}>
          <path d="M25 45 C25 39 29 39 31 37 L44 24 L50 30 L37 43 C35 45 31 45 25 45 Z" />
          <circle cx="27" cy="42.5" r="2.2" fill="rgba(255,255,255,0.96)" stroke="none" />
        </g>
      );
    case 'video-editing':
      return (
        <g {...glyphProps}>
          <rect x="21" y="30" width="32" height="16" rx="2.5" />
          <path d="M21 30 L27 23 H35 L29 30 M35 23 H43 L37 30" />
        </g>
      );
    case 'marketing':
      return (
        <g {...glyphProps}>
          <path d="M23 32 V38 L27 39 V31 Z" />
          <path d="M27 31 L48 23 V47 L27 39" />
          <path d="M30 40 L32 47" />
        </g>
      );
    case 'business':
      return (
        <g {...glyphProps}>
          <rect x="21" y="30" width="32" height="18" rx="3" />
          <path d="M31 30 V26 C31 24.3 32.3 23 34 23 H40 C41.7 23 43 24.3 43 26 V30" />
        </g>
      );
    case 'finance':
      return (
        <g {...glyphProps}>
          <circle cx="37" cy="35" r="13" />
          <path d="M37 29 V41 M40.5 31.5 C40.5 29.6 39 29 37 29 C34.8 29 33.5 30 33.5 31.6 C33.5 34.6 40.5 33.6 40.5 36.7 C40.5 38.5 39 39.4 37 39.4 C35 39.4 33.5 38.7 33.5 37" />
        </g>
      );
    case 'languages':
      return (
        <g {...glyphProps}>
          <circle cx="37" cy="35" r="13" />
          <path d="M24 35 H50 M37 22 C41 26 41 44 37 48 C33 44 33 26 37 22 Z" />
        </g>
      );
    case 'music':
      return (
        <g {...glyphProps}>
          <circle cx="30" cy="43" r="4" />
          <circle cx="45" cy="40" r="4" />
          <path d="M34 43 V26 L49 23 V40" />
        </g>
      );
    case 'photography':
      return (
        <g {...glyphProps}>
          <rect x="21" y="28" width="32" height="20" rx="3" />
          <path d="M29 28 L32 23 H42 L45 28" />
          <circle cx="37" cy="38" r="6.2" />
        </g>
      );
    case 'cooking':
      return (
        <g {...glyphProps}>
          <path d="M24 44 H50" />
          <path d="M26 44 C26 33 30 26 37 26 C44 26 48 33 48 44" />
        </g>
      );
    case 'fitness':
      return (
        <g {...glyphProps}>
          <path d="M24 35 H50" />
          <path d="M22 30 V40 M27 32 V38 M47 32 V38 M52 30 V40" />
        </g>
      );
    default:
      return <circle cx="37" cy="35" r="10" {...glyphProps} />;
  }
}

export default function SkillIcon3D({ category, size = 56, className = '' }) {
  const uid = React.useId().replace(/[:]/g, '');
  const recipe = RECIPES[category] || DEFAULT_RECIPE;
  const gradId = `si3d-grad-${uid}`;
  const shadowId = `si3d-shadow-${uid}`;

  return (
    <div
      className={`skill-icon-3d ${className}`}
      style={{ width: size, height: size, '--icon-glow': recipe.glow }}
    >
      <svg viewBox="0 0 74 84" width="100%" height="100%" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={recipe.from} />
            <stop offset="100%" stopColor={recipe.to} />
          </linearGradient>
          <filter id={shadowId} x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2.2" floodColor="#000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* floating shadow */}
        <ellipse cx="37" cy="74" rx="17" ry="4.6" fill={recipe.to} opacity="0.28" />

        {/* glass tile */}
        <rect x="9" y="12" width="56" height="56" rx="17" fill={`url(#${gradId})`} filter={`url(#${shadowId})`} />
        <rect x="9" y="12" width="56" height="56" rx="17" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />

        {/* gloss highlight */}
        <ellipse cx="24" cy="24" rx="13" ry="8" fill="rgba(255,255,255,0.28)" />

        {/* bottom bevel shade */}
        <path d="M9 50 v3.5A16.5 16.5 0 0 0 25.5 70h23A16.5 16.5 0 0 0 65 53.5V50z" fill="rgba(0,0,0,0.14)" />

        <Glyph category={category} />
      </svg>
    </div>
  );
}
