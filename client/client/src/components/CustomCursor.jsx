import React, { useEffect, useRef, useState } from 'react';

// A premium two-part custom cursor: a small solid dot that tracks instantly,
// and a larger ring that trails with easing and grows over clickable
// elements. Disabled on touch devices and under prefers-reduced-motion.
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reduced) return;
    setEnabled(true);
    document.body.classList.add('custom-cursor-active');

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0, raf = 0;

    const onMove = (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    };

    const onOver = (e) => {
      const interactive = e.target.closest('a, button, input, textarea, [role="button"], .continue-card, .col-card, .cert-card');
      if (ringRef.current) ringRef.current.classList.toggle('hover', !!interactive);
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
}
