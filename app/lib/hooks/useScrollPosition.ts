'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to track the current scroll position of the window.
 * Returns the current scrollY value, updated on every scroll event.
 */
export function useScrollPosition(): number {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Initialize with current position
    setScrollPosition(window.scrollY);

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollPosition;
}
