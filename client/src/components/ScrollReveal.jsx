import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';

// GSAP + ScrollTrigger reveal. Same public API as the old IntersectionObserver
// version (as/delay/className/style), plus an optional `stagger` prop: pass
// `true` (or a number = seconds between children) to animate each direct
// child in sequence instead of the container as one block — use this for
// grids (mentor-grid, skills-grid, three-col) where a staggered cascade
// reads better than everything fading in at once.
export default function ScrollReveal({ children, as: Tag = 'div', delay = 0, stagger = false, className = '', style = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (stagger) {
      const kids = Array.from(el.children);
      if (reduced || !kids.length) {
        gsap.set(el, { opacity: 1 });
        gsap.set(kids, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(el, { opacity: 1 });
      gsap.set(kids, { opacity: 0, y: 28 });

      const ctx = gsap.context(() => {
        gsap.to(kids, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: delay / 1000,
          stagger: typeof stagger === 'number' ? stagger : 0.08,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        });
      }, el);

      return () => ctx.revert();
    }

    if (reduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: delay / 1000,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    }, el);

    return () => ctx.revert();
  }, [delay, stagger]);

  return (
    <Tag ref={ref} className={`scroll-reveal ${className}`} style={style}>
      {children}
    </Tag>
  );
}
