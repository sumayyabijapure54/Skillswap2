import React from 'react';

/**
 * SkillIcon3D — displays a realistic 3D-render icon per skill category.
 *
 * Drop your downloaded PNGs into:
 *   client/src/assets/skill-icons/<category-key>.png
 * using the exact category keys from data/skills.js, e.g.:
 *   programming.png, ai-ml.png, web-development.png, mobile-development.png,
 *   design.png, graphic-design.png, video-editing.png, marketing.png,
 *   business.png, finance.png, languages.png, music.png,
 *   photography.png, cooking.png, fitness.png
 *
 * The wrapper adds a color-matched glow + floating shadow so the image
 * sits naturally on your dark, glass-panel card — the image itself does
 * the visual heavy lifting, this just makes it feel native to the theme.
 *
 * Scoped to .explore-card only (course cards) — no other component
 * imports this.
 */

// Eagerly import every png in assets/skill-icons so missing files simply
// don't appear (no build errors), and new ones are picked up automatically.
const iconModules = import.meta.glob('../assets/skill-icons/*.png', {
  eager: true,
  import: 'default',
});

function resolveIcon(category) {
  const match = Object.entries(iconModules).find(([path]) =>
    path.endsWith(`/${category}.png`)
  );
  return match ? match[1] : null;
}

const GLOW = {
  'programming': 'rgba(99,102,241,0.45)',
  'ai-ml': 'rgba(255,107,203,0.4)',
  'web-development': 'rgba(20,240,180,0.45)',
  'mobile-development': 'rgba(255,122,69,0.4)',
  'design': 'rgba(196,132,252,0.4)',
  'graphic-design': 'rgba(251,113,133,0.4)',
  'video-editing': 'rgba(248,113,113,0.4)',
  'marketing': 'rgba(251,191,36,0.4)',
  'business': 'rgba(96,165,250,0.4)',
  'finance': 'rgba(52,211,153,0.4)',
  'languages': 'rgba(34,211,238,0.4)',
  'music': 'rgba(155,123,255,0.4)',
  'photography': 'rgba(244,114,182,0.4)',
  'cooking': 'rgba(251,191,36,0.4)',
  'fitness': 'rgba(251,113,133,0.4)',
};
const DEFAULT_GLOW = 'rgba(20,240,180,0.4)';

export default function SkillIcon3D({ category, size = 72, className = '' }) {
  const src = resolveIcon(category);
  const glow = GLOW[category] || DEFAULT_GLOW;

  if (!src) {
    // Graceful fallback if an icon hasn't been added yet for this category —
    // renders nothing rather than a broken image.
    return null;
  }

  return (
    <div
      className={`skill-icon-3d ${className}`}
      style={{ width: size, height: size, '--icon-glow': glow }}
    >
      <img src={src} alt="" draggable="false" />
      <span className="skill-icon-3d-shadow" />
    </div>
  );
}
