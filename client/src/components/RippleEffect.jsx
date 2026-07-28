import React, { useEffect } from 'react';

const RIPPLE_SELECTOR = 'button, .btn-solid, .btn-primary-lg, .btn-ghost-lg, .btn-white, .btn-outline, [data-ripple]';

// Mounted once in App.jsx. Delegated pointerdown listener so every button
// in the app gets the ripple micro-interaction without touching each call
// site individually.
export default function RippleEffect() {
  useEffect(() => {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const onPointerDown = (e) => {
      const target = e.target.closest(RIPPLE_SELECTOR);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;

      const span = document.createElement('span');
      span.className = 'ripple-el';
      span.style.width = `${size}px`;
      span.style.height = `${size}px`;
      span.style.left = `${e.clientX - rect.left - size / 2}px`;
      span.style.top = `${e.clientY - rect.top - size / 2}px`;

      target.appendChild(span);
      span.addEventListener('animationend', () => span.remove());
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return null;
}
