import React from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const onToggle = (e) => {
    // Browsers without the View Transitions API (Firefox, older Safari)
    // just get the plain colour crossfade already set up in index.css —
    // no special handling needed, this simply skips the reveal animation.
    if (!document.startViewTransition || (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)) {
      toggleTheme();
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    const root = document.documentElement;
    root.style.setProperty('--vt-x', `${x}px`);
    root.style.setProperty('--vt-y', `${y}px`);
    root.style.setProperty('--vt-radius', `${radius}px`);

    // startViewTransition needs the DOM change captured synchronously
    // inside its callback — React's setState is normally batched/async, so
    // flushSync forces the theme attribute swap to commit immediately.
    document.startViewTransition(() => {
      flushSync(() => toggleTheme());
    });
  };

  return (
    <button
      className={`icon-btn theme-toggle ${className}`}
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className={`theme-toggle-icon ${isDark ? '' : 'flipped'}`}>{isDark ? '🌙' : '☀️'}</span>
    </button>
  );
}
