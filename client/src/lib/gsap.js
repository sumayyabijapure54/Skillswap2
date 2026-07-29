import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// Register once, app-wide. Every component that needs GSAP imports from
// here rather than from 'gsap' directly, so plugins are guaranteed to be
// registered before use regardless of import order.
gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };
