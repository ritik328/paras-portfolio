'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to track window scroll position.
 * Integrates with GSAP ScrollTrigger / ScrollSmoother updates when available,
 * using a 5px delta threshold to prevent unnecessary state re-renders.
 */
export function useScrollPosition(): number {
  const [scrollPosition, setScrollPosition] = useState(0);
  const lastValueRef = useRef(0);

  useEffect(() => {
    let stInstance: any = null;

    const initListener = async () => {
      const y = window.scrollY || 0;
      lastValueRef.current = y;
      setScrollPosition(y);

      try {
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');

        stInstance = ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            const currentY = Math.round(self.scroll());
            if (Math.abs(currentY - lastValueRef.current) >= 5) {
              lastValueRef.current = currentY;
              setScrollPosition(currentY);
            }
          },
        });
      } catch (_) {
        // Fallback to native listener if GSAP is unavailable
        const handleScroll = () => {
          const currentY = window.scrollY;
          if (Math.abs(currentY - lastValueRef.current) >= 5) {
            lastValueRef.current = currentY;
            setScrollPosition(currentY);
          }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
      }
    };

    initListener();

    return () => {
      if (stInstance) {
        stInstance.kill();
      }
    };
  }, []);

  return scrollPosition;
}
