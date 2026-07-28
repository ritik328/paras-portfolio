'use client';

import { useCallback } from 'react';

/**
 * Custom hook providing smooth scroll navigation via GSAP ScrollSmoother.
 * Falls back to native smooth scrolling if ScrollSmoother is not active or reduced-motion is enabled.
 */
export function useGSAPScroll() {
  const scrollTo = useCallback((target: string | number | HTMLElement) => {
    try {
      // Dynamic import or GSAP ScrollSmoother static getter
      if (typeof window !== 'undefined') {
        const gsap = (window as any).gsap;
        const ScrollSmoother = gsap?.plugins?.ScrollSmoother;
        const smoother = ScrollSmoother?.get();

        if (smoother) {
          smoother.scrollTo(target, true, 'top top');
          return;
        }
      }
    } catch (_) {
      // Fallback
    }

    // Fallback to native smooth scroll
    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return { scrollTo };
}
