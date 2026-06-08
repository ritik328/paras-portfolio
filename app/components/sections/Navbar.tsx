'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Cpu, Briefcase, FolderCode, GraduationCap, Mail, Sun, Moon } from 'lucide-react';
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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const themeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isScrolled = scrollPosition > 50;

  // Debounced resize handler
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 150);
    };
    // Initialize immediately
    setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    };
  }, []);

  // Sync theme with local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);

    // Add transitioning class so CSS transitions fire during the switch
    document.documentElement.classList.add('theme-transitioning');

    // Clean up any existing timer
    if (themeTimerRef.current) clearTimeout(themeTimerRef.current);

    // Remove the class after transitions complete
    themeTimerRef.current = setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 600);
  }, [theme]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (themeTimerRef.current) clearTimeout(themeTimerRef.current);
    };
  }, []);

  const isMobileBottom = isMobile && isScrolled;

  // Adaptive styles based on position and mobile/desktop states
  const wrapperClass = isMobileBottom
    ? 'h-10 px-2.5 gap-1.5 bg-surface-secondary/90 border border-border/90 rounded-full shadow-2xl shadow-black/80'
    : 'h-14 px-4 gap-3 bg-surface-secondary/60 border border-border/50 rounded-2xl';

  const buttonSizeClass = isMobileBottom ? 'w-[30px] h-[30px] rounded-full' : 'w-10 h-10 rounded-xl';
  const iconSizeClass = isMobileBottom ? 'size-[14px]' : 'size-[18px]';
  const tooltipPositionClass = isMobileBottom ? 'bottom-full mb-2' : 'top-full mt-2';

  return (
    <>
      {/* Floating Dock Navigation — no `layout` prop to avoid expensive layout recalculations */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed z-50 flex items-center backdrop-blur-md transition-all duration-300 ease-out -translate-x-1/2 left-1/2 ${
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
              className={`flex items-center justify-center text-text-secondary hover:text-accent-orange hover:bg-surface-tertiary/50 transition-colors duration-200 cursor-pointer ${buttonSizeClass}`}
              aria-label={`Scroll to ${item.label}`}
              role="menuitem"
            >
              <item.icon className={iconSizeClass} />
            </motion.button>

            {/* Adaptive Tooltip */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 ${tooltipPositionClass}`}
            >
              <div className="px-2.5 py-1 bg-surface-secondary border border-border text-text-primary text-[10px] font-mono rounded-lg shadow-xl whitespace-nowrap">
                {item.label}
              </div>
            </div>
          </div>
        ))}

        {/* Divider */}
        <div className={`w-[1px] bg-border/50 self-stretch my-2.5 mx-1 ${isMobileBottom ? 'my-2 mx-0.5' : 'my-2.5 mx-1'}`} />

        {/* Theme Toggle Button with animated Sun/Moon rotation */}
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.15, y: isMobileBottom ? -1 : -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`flex items-center justify-center text-text-secondary hover:text-accent-orange hover:bg-surface-tertiary/50 transition-colors duration-200 cursor-pointer overflow-hidden ${buttonSizeClass}`}
            aria-label="Toggle light and dark theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex items-center justify-center"
                >
                  <Sun className={iconSizeClass} />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex items-center justify-center"
                >
                  <Moon className={iconSizeClass} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          <div className={`absolute left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 ${tooltipPositionClass}`}>
            <div className="px-2.5 py-1 bg-surface-secondary border border-border text-text-primary text-[10px] font-mono rounded-lg shadow-xl whitespace-nowrap">
              {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
            </div>
          </div>
        </div>
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
