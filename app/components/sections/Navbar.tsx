'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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

  const isScrolled = scrollPosition > 50;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync theme with local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

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

        {/* Theme Toggle Button */}
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.15, y: isMobileBottom ? -1 : -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`flex items-center justify-center text-text-secondary hover:text-accent-orange hover:bg-surface-tertiary/50 transition-colors duration-200 cursor-pointer ${buttonSizeClass}`}
            aria-label="Toggle light and dark theme"
          >
            {theme === 'dark' ? (
              <Sun className={iconSizeClass} />
            ) : (
              <Moon className={iconSizeClass} />
            )}
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
