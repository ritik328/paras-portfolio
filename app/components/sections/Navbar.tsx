'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
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

const mobileNavItems = [
  { label: 'Home', href: '#top', icon: Home },
  { label: 'About', href: '#about', icon: User },
  { label: 'Skills', href: '#skills', icon: Cpu },
  { label: 'Projects', href: '#projects', icon: FolderCode },
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
  const [activeSection, setActiveSection] = useState('Home');
  const themeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // IntersectionObserver scroll spy to auto-expand active mobile category
  useEffect(() => {
    if (!isMobile) return;

    const sections = ['top', 'about', 'skills', 'experience', 'projects', 'education', 'contact'];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const nameMap: Record<string, string> = {
              top: 'Home',
              about: 'About',
              skills: 'Skills',
              experience: 'Projects',
              projects: 'Projects',
              education: 'About',
              contact: 'Contact',
            };
            setActiveSection(nameMap[id]);
          }
        },
        {
          rootMargin: '-25% 0px -55% 0px', // Trigger mid-screen
        }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, [isMobile]);

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

  return (
    <>
      {/* ── Desktop Navbar ────────────────────────────────────────────────── */}
      {!isMobile && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed z-50 flex items-center backdrop-blur-md transition-all duration-300 ease-out -translate-x-1/2 left-1/2 top-5 h-14 px-4 gap-3 bg-surface-secondary/60 border border-border/50 rounded-2xl"
          role="navigation"
          aria-label="Main navigation dock"
        >
          {/* Navigation Section Links */}
          {navItems.map((item) => (
            <div key={item.label} className="relative group" role="none">
              <motion.button
                whileHover={{ scale: 1.15, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                onClick={() => scrollTo(item.href)}
                className="flex items-center justify-center text-text-secondary hover:text-accent-orange hover:bg-surface-tertiary/50 transition-colors duration-200 cursor-pointer w-10 h-10 rounded-xl"
                aria-label={`Scroll to ${item.label}`}
                role="menuitem"
              >
                <item.icon className="size-[18px]" />
              </motion.button>

              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 top-full mt-2">
                <div className="px-2.5 py-1 bg-surface-secondary border border-border text-text-primary text-[10px] font-mono rounded-lg shadow-xl whitespace-nowrap">
                  {item.label}
                </div>
              </div>
            </div>
          ))}

          {/* Divider */}
          <div className="w-[1px] bg-border/50 self-stretch my-2.5 mx-1" />

          {/* Theme Toggle Button */}
          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="flex items-center justify-center text-text-secondary hover:text-accent-orange hover:bg-surface-tertiary/50 transition-colors duration-200 cursor-pointer overflow-hidden w-10 h-10 rounded-xl"
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
                    <Sun className="size-[18px]" />
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
                    <Moon className="size-[18px]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 top-full mt-2">
              <div className="px-2.5 py-1 bg-surface-secondary border border-border text-text-primary text-[10px] font-mono rounded-lg shadow-xl whitespace-nowrap">
                {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
              </div>
            </div>
          </div>
        </motion.nav>
      )}

      {/* ── Mobile Floating Theme Toggle ──────────────────────────────────── */}
      {isMobile && (
        <div className="fixed top-4 right-4 z-50">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="flex items-center justify-center text-text-secondary hover:text-accent-orange bg-surface-secondary/80 border border-border/40 backdrop-blur-md rounded-full shadow-lg w-10 h-10 cursor-pointer overflow-hidden"
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
                  <Sun className="size-[16px]" />
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
                  <Moon className="size-[16px]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      )}

      {/* ── Mobile Liquid Navigation Dock ─────────────────────────────────── */}
      {isMobile && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-none w-[90%] max-w-[340px]">
          <LayoutGroup id="mobile-liquid-nav">
            <div className="flex items-center justify-around gap-1.5 px-3 py-2 bg-surface-secondary/80 border border-border/40 backdrop-blur-md rounded-full shadow-2xl pointer-events-auto w-full">
              {mobileNavItems.map((item) => {
                const isActive = activeSection === item.label;
                return (
                  <motion.button
                    key={item.label}
                    layout
                    onClick={() => {
                      setActiveSection(item.label);
                      scrollTo(item.href);
                    }}
                    className={`relative flex items-center justify-center h-9 px-3.5 rounded-full cursor-pointer transition-colors duration-300 ${
                      isActive
                        ? 'text-accent-orange bg-surface-tertiary/70 border border-border/50 shadow-inner'
                        : 'text-text-secondary hover:text-text-primary border border-transparent bg-transparent'
                    }`}
                    style={{ borderRadius: 20 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  >
                    <item.icon className="size-[15px] flex-shrink-0" />
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.span
                          initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                          animate={{ width: 'auto', opacity: 1, marginLeft: 6 }}
                          exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          className="text-[11.5px] font-sans font-semibold whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>
      )}

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
