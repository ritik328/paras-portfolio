'use client';

import { useEffect, useCallback } from 'react';

interface LenisInstance {
  scrollTo: (target: string | number | HTMLElement, options?: { duration?: number; offset?: number }) => void;
  destroy: () => void;
  raf: (time: number) => void;
  on: (event: string, callback: () => void) => void;
}

// ── Module-level singleton ──────────────────────────────────────────────────
// Only one Lenis instance will ever exist, regardless of how many components
// call useSmoothScroll(). This prevents duplicate RAF loops and scroll conflicts.
let lenisInstance: LenisInstance | null = null;
let rafId: number | null = null;
let refCount = 0;

async function initLenis(): Promise<void> {
  if (lenisInstance) return; // already initialized

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  try {
    const { default: Lenis } = await import('lenis');
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    }) as unknown as LenisInstance;

    // Start the animation loop
    function raf(time: number) {
      lenisInstance!.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
  } catch (error) {
    console.error('Failed to initialize Lenis:', error);
  }
}

function destroyLenis(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

/**
 * Custom hook to initialize and manage Lenis smooth scroll.
 * Uses a module-level singleton — only one Lenis instance exists globally.
 * Provides a scrollTo function for programmatic navigation.
 * Respects prefers-reduced-motion for accessibility.
 */
export function useSmoothScroll() {
  useEffect(() => {
    refCount++;
    if (refCount === 1) {
      initLenis();
    }

    return () => {
      refCount--;
      if (refCount === 0) {
        destroyLenis();
      }
    };
  }, []);

  const scrollTo = useCallback((target: string | number | HTMLElement) => {
    if (lenisInstance) {
      lenisInstance.scrollTo(target, { duration: 1.2 });
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
