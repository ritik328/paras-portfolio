'use client';

import { useEffect, useRef, useCallback } from 'react';

interface LenisInstance {
  scrollTo: (target: string | number | HTMLElement, options?: { duration?: number; offset?: number }) => void;
  destroy: () => void;
  raf: (time: number) => void;
  on: (event: string, callback: () => void) => void;
}

/**
 * Custom hook to initialize and manage Lenis smooth scroll.
 * Provides a scrollTo function for programmatic navigation.
 * Respects prefers-reduced-motion for accessibility.
 */
export function useSmoothScroll() {
  const lenisRef = useRef<LenisInstance | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let lenis: LenisInstance | null = null;

    // Dynamic import to avoid SSR issues
    const initLenis = async () => {
      try {
        const { default: Lenis } = await import('lenis');
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        }) as unknown as LenisInstance;

        lenisRef.current = lenis;

        // Integrate with GSAP ScrollTrigger if available
        if (typeof window !== 'undefined') {
          lenis.on('scroll', () => {
            // Notify ScrollTrigger of scroll updates
            if ((window as unknown as { ScrollTrigger?: { update: () => void } }).ScrollTrigger) {
              (window as unknown as { ScrollTrigger: { update: () => void } }).ScrollTrigger.update();
            }
          });
        }

        // Start the animation loop
        function raf(time: number) {
          lenis!.raf(time);
          rafRef.current = requestAnimationFrame(raf);
        }

        rafRef.current = requestAnimationFrame(raf);
      } catch (error) {
        console.error('Failed to initialize Lenis:', error);
      }
    };

    initLenis();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  const scrollTo = useCallback((target: string | number | HTMLElement) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { duration: 1.2 });
    } else {
      // Fallback to native smooth scroll
      if (typeof target === 'string') {
        const element = document.querySelector(target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
    }
  }, []);

  return { scrollTo };
}
