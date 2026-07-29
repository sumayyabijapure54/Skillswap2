import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';

// Continuous horizontal-scrolling text band (GSAP infinite tween, not CSS
// animation, so speed is distance-based and stays consistent regardless of
// how many items/how wide the row ends up being).
export default function Marquee({ items = [], speed = 60, className = '' }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const halfWidth = track.scrollWidth / 2;
      gsap.fromTo(track, { x: 0 }, {
        x: -halfWidth,
        duration: halfWidth / speed,
        ease: 'none',
        repeat: -1
      });
    }, track);

    return () => ctx.revert();
  }, [items, speed]);

  return (
    <div className={`marquee-wrap ${className}`}>
      <div className="marquee-track" ref={trackRef}>
        {[...items, ...items].map((it, i) => (
          <span className="marquee-item" key={i}>{it}</span>
        ))}
      </div>
    </div>
  );
}
