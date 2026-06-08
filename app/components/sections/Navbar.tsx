'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Home, User, Cpu, Briefcase, FolderCode, GraduationCap, Mail } from 'lucide-react';
import { useScrollPosition } from '@/app/lib/hooks/useScrollPosition';
import { useSmoothScroll } from '@/app/lib/hooks/useSmoothScroll';

const navItems = [
  { label: 'Home', href: '#top', icon: Home },
  { label: 'About', href: '#about', icon: User },
  { label: 'Skills', href: '#skills', icon: Cpu },
  { label: 'Experience', href: '#experience', icon: Briefcase },
  { label: 'Projects', href: '#projects', icon: FolderCode },
  { label: 'Education', href: '#education', icon: GraduationCap },
  { label: 'Contact', href: '#contact', icon: Mail },
];


/**
 * Fixed/Floating navigation Dock with frosted glass effect.
 * Smoothly morphs from top to bottom on mobile when scrolled.
 */
export function Navbar() {
  const scrollPosition = useScrollPosition();
  const { scrollTo } = useSmoothScroll();
  const [isMobile, setIsMobile] = useState(false);

  const lastClickRef = useRef<number>(0);
  const clickCountRef = useRef<number>(0);

  const isScrolled = scrollPosition > 50;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBrandClick = () => {
    scrollTo('#top');
    const now = Date.now();
    if (now - lastClickRef.current < 800) {
      clickCountRef.current += 1;
    } else {
      clickCountRef.current = 1;
    }
    lastClickRef.current = now;

    if (clickCountRef.current >= 3) {
      window.dispatchEvent(new CustomEvent('toggle-hero-editor'));
      clickCountRef.current = 0;
    }
  };

  const isMobileBottom = isMobile && isScrolled;

  // Adaptive styles based on position and mobile/desktop states
  const wrapperClass = isMobileBottom
    ? 'h-10 px-2.5 gap-1.5 bg-[#1a1a18]/90 border border-[#3a3a38]/90 rounded-full shadow-2xl shadow-black/80'
    : 'h-14 px-4 gap-3 bg-[#1a1a18]/60 border border-[#3a3a38]/50 rounded-2xl';

  const buttonSizeClass = isMobileBottom ? 'w-[30px] h-[30px] rounded-full' : 'w-10 h-10 rounded-xl';
  const iconSizeClass = isMobileBottom ? 'size-[14px]' : 'size-[18px]';
  const tooltipPositionClass = isMobileBottom ? 'bottom-full mb-2' : 'top-full mt-2';

  return (
    <>
      {/* Brand logo header (fades out on mobile scroll down) */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 pointer-events-none transition-all duration-300 ${
          isScrolled && isMobile ? 'opacity-0 -translate-y-4' : 'opacity-100'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-20 h-20 flex justify-between items-center">
          <button
            onClick={handleBrandClick}
            className="pointer-events-auto font-serif text-lg tracking-widest text-[#f0ede6] hover:text-[#e07040] transition-all duration-300 select-none cursor-pointer border border-[#3a3a38]/40 px-3.5 py-1 bg-[#1a1a18]/65 rounded-xl backdrop-blur-md shadow-sm hover:border-[#e07040]/30 hover:shadow-[#e07040]/5"
            aria-label="Scroll to top"
          >
            PN
          </button>
        </div>
      </header>

      {/* Floating Dock Navigation */}
      <motion.nav
        layout
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        className={`fixed z-50 flex items-center backdrop-blur-md transition-colors duration-300 -translate-x-1/2 left-1/2 ${
          isMobileBottom ? 'bottom-6' : isMobile ? 'top-16' : 'top-5'
        } ${wrapperClass}`}
        role="navigation"
        aria-label="Main navigation dock"
      >
        {/* Navigation Section Links */}
        {navItems.map((item) => (
          <div key={item.label} className="relative group" role="none">
            <motion.button
              whileHover={{ scale: 1.15, y: isMobileBottom ? -1 : -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              onClick={() => scrollTo(item.href)}
              className={`flex items-center justify-center text-[#888884] hover:text-[#e07040] hover:bg-[#2a2a28]/50 transition-colors duration-200 cursor-pointer ${buttonSizeClass}`}
              aria-label={`Scroll to ${item.label}`}
              role="menuitem"
            >
              <item.icon className={iconSizeClass} />
            </motion.button>

            {/* Adaptive Tooltip */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 ${tooltipPositionClass}`}
            >
              <div className="px-2.5 py-1 bg-[#161614] border border-[#3a3a38] text-[#f0ede6] text-[10px] font-mono rounded-lg shadow-xl whitespace-nowrap">
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </motion.nav>

      {/* Accessibility Skip Link */}
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#e07040] focus:text-[#0d0d0c] focus:rounded-lg focus:font-medium"
      >
        Skip to main content
      </a>
    </>
  );
}
