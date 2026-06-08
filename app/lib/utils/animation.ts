import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Animate an element into view with fade and slide effect.
 */
export function animateFadeInUp(
  target: gsap.TweenTarget,
  options?: {
    trigger?: string | Element;
    start?: string;
    duration?: number;
    delay?: number;
    stagger?: number;
  }
) {
  return gsap.fromTo(
    target,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: options?.duration ?? 0.8,
      delay: options?.delay ?? 0,
      stagger: options?.stagger ?? 0,
      ease: 'power2.out',
      scrollTrigger: options?.trigger
        ? {
            trigger: options.trigger,
            start: options.start ?? 'top 80%',
          }
        : undefined,
    }
  );
}

/**
 * Animate an element sliding in from the right.
 */
export function animateSlideInRight(
  target: gsap.TweenTarget,
  options?: {
    trigger?: string | Element;
    start?: string;
    stagger?: number;
  }
) {
  return gsap.fromTo(
    target,
    { opacity: 0, x: 50 },
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      stagger: options?.stagger ?? 0.2,
      ease: 'power2.out',
      scrollTrigger: options?.trigger
        ? {
            trigger: options.trigger,
            start: options.start ?? 'top 70%',
          }
        : undefined,
    }
  );
}

/**
 * Animate a scale-Y from 0 to 1 (for timeline lines).
 */
export function animateScaleY(
  target: gsap.TweenTarget,
  options?: {
    trigger?: string | Element;
    start?: string;
  }
) {
  return gsap.fromTo(
    target,
    { scaleY: 0 },
    {
      scaleY: 1,
      duration: 1,
      ease: 'power2.out',
      transformOrigin: 'top center',
      scrollTrigger: options?.trigger
        ? {
            trigger: options.trigger,
            start: options.start ?? 'top 70%',
          }
        : undefined,
    }
  );
}

export { gsap, ScrollTrigger };
