'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useScrollPosition } from '@/app/lib/hooks/useScrollPosition';
import { useGSAPScroll } from '@/app/lib/hooks/useGSAPScroll';

/**
 * Footer with copyright and GSAP-driven scroll-to-top button.
 */
export function Footer() {
  const scrollPosition = useScrollPosition();
  const { scrollTo } = useGSAPScroll();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setShowScrollTop(scrollPosition > 300);
  }, [scrollPosition]);

  return (
    <footer className="bg-[#1a1a18] border-t border-[#3a3a38]" role="contentinfo">
      <div className="max-w-[1200px] mx-auto px-20 max-md:px-6 py-8 flex justify-between items-center">
        <div>
          <p className="text-[#888884] text-sm">
            © {new Date().getFullYear()} Paras Negi. All rights reserved.
          </p>
          <p className="text-[#3a3a38] text-xs mt-1">
            Built with Next.js · GSAP · D3.js · Tailwind CSS
          </p>
        </div>

        {/* Scroll to top */}
        <button
          onClick={() => scrollTo('#top')}
          className={`p-3 bg-[#2a2a28] rounded-xl hover:bg-[#e07040] transition-all duration-300 group cursor-pointer ${
            showScrollTop
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-90 pointer-events-none'
          }`}
          aria-label="Scroll to top of page"
        >
          <ArrowUp
            size={20}
            className="text-[#888884] group-hover:text-[#0d0d0c] transition-colors"
          />
        </button>
      </div>
    </footer>
  );
}
