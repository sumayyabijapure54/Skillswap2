import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap.js';

let lenis = null;
let tickerFn = null;

// Lenis drives the actual (eased) scroll position; ScrollTrigger just
// needs to be told to re-check itself whenever that position changes, and
// GSAP's own ticker is what actually steps Lenis forward each frame (so
// everything — smooth scroll, scroll-triggered tweens, and parallax — is
// on one shared rAF loop instead of fighting over separate ones).
export function initSmoothScroll() {
  if (lenis) return lenis;

  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return null;

  lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    wheelMultiplier: 1
  });

  lenis.on('scroll', ScrollTrigger.update);

  tickerFn = (time) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis() {
  return lenis;
}

// Route changes used to do a hard window.scrollTo(0,0). With Lenis owning
// the scroll position, an "immediate" Lenis scroll keeps that instant jump
// while still leaving Lenis's internal state in sync.
export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
}

export function destroySmoothScroll() {
  if (tickerFn) gsap.ticker.remove(tickerFn);
  if (lenis) lenis.destroy();
  lenis = null;
  tickerFn = null;
}
