import React, { useEffect, useRef } from 'react';
import { gsap, SplitText } from '../lib/gsap.js';

// Character/word/line reveal via GSAP's SplitText. Reads the mounted DOM
// node's live content, so it works fine with nested markup (e.g. a <br/>
// and a <span> inside an <h1>) — pass normal JSX as children.
export default function SplitTextReveal({
  children,
  as: Tag = 'h1',
  className = '',
  type = 'chars',
  trigger = 'load',
  delay = 0
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let split;
    const ctx = gsap.context(() => {
      split = new SplitText(el, { type, charsClass: 'split-char', wordsClass: 'split-word', linesClass: 'split-line' });
      const targets = type === 'chars' ? split.chars : type === 'words' ? split.words : split.lines;

      gsap.from(targets, {
        opacity: 0,
        yPercent: 110,
        duration: 0.7,
        ease: 'power4.out',
        stagger: 0.02,
        delay: delay / 1000,
        scrollTrigger: trigger === 'scroll' ? { trigger: el, start: 'top 85%', once: true } : undefined
      });
    }, el);

    return () => {
      ctx.revert();
      split && split.revert();
    };
  }, [type, trigger, delay]);

  return (
    <Tag ref={ref} className={`split-text-mask ${className}`}>
      {children}
    </Tag>
  );
}
