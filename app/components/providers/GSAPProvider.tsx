'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { gsap, ScrollSmoother } from '@/app/lib/gsap';

interface GSAPContextType {
  smoother: any | null;
  isReducedMotion: boolean;
}

const GSAPContext = createContext<GSAPContextType>({
  smoother: null,
  isReducedMotion: false,
});

export const useGSAP = () => useContext(GSAPContext);

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  const [smoother, setSmoother] = useState<any | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduced = mediaQuery.matches;
    setIsReducedMotion(reduced);

    if (reduced) return; // Skip smooth scrolling if reduced motion is requested

    let smootherInstance: any = null;

    if (wrapperRef.current && contentRef.current) {
      try {
        smootherInstance = ScrollSmoother.create({
          wrapper: wrapperRef.current,
          content: contentRef.current,
          smooth: 1.2,
          effects: true,
          normalizeScroll: true,
        });
        setSmoother(smootherInstance);
      } catch (err) {
        console.error('Error creating ScrollSmoother:', err);
      }
    }

    return () => {
      if (smootherInstance) {
        smootherInstance.kill();
      }
    };
  }, []);

  return (
    <GSAPContext.Provider value={{ smoother, isReducedMotion }}>
      <div id="smooth-wrapper" ref={wrapperRef} className="w-full min-h-screen overflow-hidden">
        <div id="smooth-content" ref={contentRef} className="w-full min-h-screen">
          {children}
        </div>
      </div>
    </GSAPContext.Provider>
  );
}
