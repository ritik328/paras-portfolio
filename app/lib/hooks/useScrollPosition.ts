'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to track the current scroll position of the window.
 * Throttled via requestAnimationFrame and a minimum-change threshold
 * to avoid unnecessary re-renders (critical for mobile performance).
 */
export function useScrollPosition(): number {
  const [scrollPosition, setScrollPosition] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastValueRef = useRef(0);

  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) return; // already scheduled

    rafRef.current = requestAnimationFrame(() => {
      const y = window.scrollY;
      // Only update state if position changed by at least 5px
      if (Math.abs(y - lastValueRef.current) >= 5) {
        lastValueRef.current = y;
        setScrollPosition(y);
      }
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    // Initialize with current position
    lastValueRef.current = window.scrollY;
    setScrollPosition(window.scrollY);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  return scrollPosition;
}
