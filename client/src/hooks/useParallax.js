import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';

// Same signature as before (speed in, ref out) but the actual motion is now
// a scrubbed GSAP/ScrollTrigger tween tied to Lenis's eased scroll position
// instead of a raw scroll-event + rAF loop.
export default function useParallax(speed = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const distance = speed * 400;

    const ctx = gsap.context(() => {
      gsap.fromTo(el, { y: -distance }, {
        y: distance,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    }, el);

    return () => ctx.revert();
  }, [speed]);

  return ref;
}
