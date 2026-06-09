'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Settings, RotateCcw, X, Sliders } from 'lucide-react';
import { useSmoothScroll } from '@/app/lib/hooks/useSmoothScroll';
import { InteractiveMap } from '@/app/components/canvas/InteractiveMap';

// ─── SVG Icons (inline — zero external deps) ───────────────────────────────────
function IconArrowRight() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" fill="none"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </svg>
  );
}

const SKILLS = ["Python", "React.js", "Django", "Node.js", "MERN Stack", "PostgreSQL"];

const SOCIAL_LINKS = [
  {
    label: "parasnegi783@gmail.com",
    href: "mailto:parasnegi783@gmail.com",
    icon: IconMail,
    ariaLabel: "Send an email",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/parasnegi783",
    icon: IconLinkedIn,
    ariaLabel: "Visit LinkedIn profile",
  },
  {
    label: "GitHub",
    href: "https://github.com/parasnegi783",
    icon: IconGitHub,
    ariaLabel: "Visit GitHub profile",
  },
];

interface LayoutSettings {
  textWidth: number; // Left column percentage
  mapWidth: number;  // Right column percentage
  textScale: number;
  mapScale: number;
  textX: number;
  textY: number;
  mapX: number;
  mapY: number;
  gap: number;
}

const DEFAULT_SETTINGS: LayoutSettings = {
  textWidth: 45,
  mapWidth: 55,
  textScale: 1.0,
  mapScale: 1.0,
  textX: 0,
  textY: 0,
  mapX: 0,
  mapY: 0,
  gap: 48,
};

/**
 * Responsive split-screen hero section.
 * Features an interactive visual editor that can be triggered by triple-clicking
 * the Hero title, Navbar logo, or Skills header.
 */
export function Hero() {
  const { scrollTo } = useSmoothScroll();
  const [settings, setSettings] = useState<LayoutSettings>(DEFAULT_SETTINGS);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const lastClickRef = useRef<number>(0);
  const clickCountRef = useRef<number>(0);

  // Image hover state
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  // Responsive layout check
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsLargeScreen(window.innerWidth >= 1024);
      }, 150);
    };
    setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  // Load settings from localStorage and set mounted status
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('hero-layout-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse layout settings', e);
      }
    }
  }, []);

  // Listen to the global event dispatched from other components (triple click)
  useEffect(() => {
    const handleToggle = () => {
      setIsEditorOpen((prev) => !prev);
    };
    window.addEventListener('toggle-hero-editor', handleToggle);
    return () => window.removeEventListener('toggle-hero-editor', handleToggle);
  }, []);

  const updateSetting = (key: keyof LayoutSettings, value: number) => {
    const updated = { ...settings, [key]: value };
    if (key === 'textWidth') {
      updated.mapWidth = 100 - value; // Auto-calculate map column to sum to 100
    }
    setSettings(updated);
    localStorage.setItem('hero-layout-settings', JSON.stringify(updated));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('hero-layout-settings', JSON.stringify(DEFAULT_SETTINGS));
  };

  const handleTitleClick = () => {
    const now = Date.now();
    if (now - lastClickRef.current < 800) {
      clickCountRef.current += 1;
    } else {
      clickCountRef.current = 1;
    }
    lastClickRef.current = now;

    if (clickCountRef.current >= 3) {
      setIsEditorOpen((prev) => !prev);
      clickCountRef.current = 0;
    }
  };

  return (
    <section
      id="top"
      className="relative w-full min-h-screen bg-surface-primary overflow-hidden flex flex-col justify-center pt-20 md:pt-0"
      aria-label="Hero section"
    >
      {/* Background visual subtle gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 80% 20%, var(--color-accent-orange) 0.05, transparent 50%)',
        }}
      />

      {/* Background grid atmosphere */}
      <div className="hero-bg-grid" aria-hidden="true" />

      {/* Right-edge rule — matches the spider web canvas boundary */}
      <div className="hero-right-rule" aria-hidden="true" />

      {/* Large ambient letter in bg */}
      <span className="hero-ambient-letter" aria-hidden="true">P</span>

      <div
        className="max-w-[1200px] w-full mx-auto px-6 md:px-20 z-10 grid md:grid-cols-2 items-center my-auto py-12 transition-all duration-300"
        style={{
          gridTemplateColumns: mounted && isLargeScreen
            ? `${settings.textWidth}% ${settings.mapWidth}%`
            : undefined,
          gap: `${mounted ? settings.gap : DEFAULT_SETTINGS.gap}px`,
        }}
      >
        {/* Left Column: Typography & CTAs */}
        <div
          className="flex flex-col justify-center text-left relative z-10"
          style={{
            transform: mounted
              ? `translate(${settings.textX}px, ${settings.textY}px) scale(${settings.textScale})`
              : undefined,
            transformOrigin: 'left center',
          }}
        >
          <div className="hero-content">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="hero-status"
              role="status"
              aria-label="Availability status"
            >
              <span className="hero-status-pulse" aria-hidden="true" />
              <span className="hero-status-text">Available for Opportunities</span>
            </motion.div>

            {/* Name block */}
            <div 
              className="relative inline-block hero-name-block cursor-pointer select-none"
              onClick={handleTitleClick}
              onMouseEnter={() => setIsTitleHovered(true)}
              onMouseLeave={() => setIsTitleHovered(false)}
              title="Triple click to open layout editor"
            >
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
                className="hero-name-first"
              >
                Paras
              </motion.h1>
              <motion.span 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
                className="hero-name-last"
                aria-label="Negi"
              >
                Negi
              </motion.span>

              <AnimatePresence>
                {isTitleHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 15, x: '-50%' }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, scale: 0.8, y: 15, x: '-50%' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transformOrigin: 'bottom center',
                      zIndex: 50,
                    }}
                    className="w-48 h-64 mb-4 rounded-2xl border-2 border-accent-orange overflow-hidden bg-surface-secondary shadow-2xl shadow-accent-orange/30 pointer-events-none"
                  >
                    <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none z-10" />
                    <img
                      src="/paras.jpg"
                      alt="Paras Negi"
                      className="w-full h-full object-cover filter contrast-[1.05] brightness-[0.95]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Role row */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
              className="hero-role-row" 
              aria-label="Role: Full-Stack Developer"
            >
              <span className="hero-role-line" aria-hidden="true" />
              <span className="hero-role">Full-Stack Developer</span>
            </motion.div>

            {/* Bio */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: 'easeOut' }}
              className="hero-bio"
            >
              I build{" "}
              <strong className="hero-bio-strong">
                elegant, high-performance
              </strong>{" "}
              web applications with robust backends and interactive user interfaces
              — from Django APIs to React frontends.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="hero-divider" 
              aria-hidden="true" 
            />

            {/* Skill chips */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="hero-tags" 
              aria-label="Core technologies"
            >
              {SKILLS.map((skill) => (
                <span key={skill} className="hero-tag">
                  {skill}
                </span>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="hero-ctas"
            >
              <button 
                onClick={() => scrollTo('#projects')} 
                className="hero-btn-primary cursor-pointer"
              >
                View My Work
                <IconArrowRight />
              </button>
              <button 
                onClick={() => scrollTo('#contact')} 
                className="hero-btn-secondary cursor-pointer"
              >
                Get in Touch
                <IconSend />
              </button>
            </motion.div>

            {/* Social / contact links */}
            <motion.nav 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="hero-socials" 
              aria-label="Contact and social links"
            >
              {SOCIAL_LINKS.map(({ label, href, icon: Icon, ariaLabel }) => (
                <a
                  key={label}
                  href={href}
                  className="hero-social-link"
                  aria-label={ariaLabel}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  <Icon />
                  {label}
                </a>
              ))}
            </motion.nav>
          </div>
        </div>

        {/* Right Column: Interactive Map Container */}
        <div
          className="w-full aspect-[8/5] relative overflow-visible group"
          style={{
            transform: mounted
              ? `translate(${settings.mapX}px, ${settings.mapY}px) scale(${settings.mapScale})`
              : undefined,
            transformOrigin: 'center center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <InteractiveMap />
          </motion.div>
        </div>
      </div>

      {/* Floating Layout Settings Editor Panel */}
      {isEditorOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-surface-secondary/95 backdrop-blur-md border border-border rounded-2xl p-5 shadow-2xl animate-fade-in text-left">
          <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-accent-orange" />
              <h3 className="font-sans font-bold text-sm text-text-primary">Hero Layout Editor</h3>
            </div>
            <button
              onClick={() => setIsEditorOpen(false)}
              className="text-text-secondary hover:text-text-primary transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 select-none font-sans text-xs">
            {/* Column Spacing (Only visible on desktop/large screens) */}
            {isLargeScreen && (
              <>
                <div>
                  <div className="flex justify-between text-text-secondary mb-1">
                    <span>Text Column Width</span>
                    <span className="font-mono text-accent-orange">{settings.textWidth}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="70"
                    value={settings.textWidth}
                    onChange={(e) => updateSetting('textWidth', Number(e.target.value))}
                    className="w-full h-1 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-accent-orange"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-text-secondary mb-1">
                    <span>Layout Gap</span>
                    <span className="font-mono text-accent-orange">{settings.gap}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="4"
                    value={settings.gap}
                    onChange={(e) => updateSetting('gap', Number(e.target.value))}
                    className="w-full h-1 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-accent-orange"
                  />
                </div>
              </>
            )}

            {/* Text Scale */}
            <div>
              <div className="flex justify-between text-text-secondary mb-1">
                <span>Text Scale</span>
                <span className="font-mono text-accent-orange">{settings.textScale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.05"
                value={settings.textScale}
                onChange={(e) => updateSetting('textScale', Number(e.target.value))}
                className="w-full h-1 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-accent-orange"
              />
            </div>

            {/* Map Scale */}
            <div>
              <div className="flex justify-between text-text-secondary mb-1">
                <span>Map Scale</span>
                <span className="font-mono text-accent-orange">{settings.mapScale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.4"
                step="0.05"
                value={settings.mapScale}
                onChange={(e) => updateSetting('mapScale', Number(e.target.value))}
                className="w-full h-1 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-accent-orange"
              />
            </div>

            {/* Text Offsets */}
            <div>
              <div className="flex justify-between text-text-secondary mb-1">
                <span>Text Translation X</span>
                <span className="font-mono text-accent-orange">{settings.textX}px</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="5"
                value={settings.textX}
                onChange={(e) => updateSetting('textX', Number(e.target.value))}
                className="w-full h-1 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-accent-orange"
              />
            </div>

            <div>
              <div className="flex justify-between text-text-secondary mb-1">
                <span>Text Translation Y</span>
                <span className="font-mono text-accent-orange">{settings.textY}px</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="5"
                value={settings.textY}
                onChange={(e) => updateSetting('textY', Number(e.target.value))}
                className="w-full h-1 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-accent-orange"
              />
            </div>

            {/* Map Offsets */}
            <div>
              <div className="flex justify-between text-text-secondary mb-1">
                <span>Map Translation X</span>
                <span className="font-mono text-accent-orange">{settings.mapX}px</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="5"
                value={settings.mapX}
                onChange={(e) => updateSetting('mapX', Number(e.target.value))}
                className="w-full h-1 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-accent-orange"
              />
            </div>

            <div>
              <div className="flex justify-between text-text-secondary mb-1">
                <span>Map Translation Y</span>
                <span className="font-mono text-accent-orange">{settings.mapY}px</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="5"
                value={settings.mapY}
                onChange={(e) => updateSetting('mapY', Number(e.target.value))}
                className="w-full h-1 bg-surface-tertiary rounded-lg appearance-none cursor-pointer accent-accent-orange"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-5 pt-3 border-t border-border">
            <div className="flex gap-3">
              <button
                onClick={resetSettings}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-surface-tertiary hover:bg-border text-text-primary rounded-xl font-medium text-xs transition-colors duration-200"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
                  alert("Settings JSON copied to clipboard! You can paste them into DEFAULT_SETTINGS inside Hero.tsx.");
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-surface-tertiary hover:bg-border text-accent-cream rounded-xl font-medium text-xs transition-colors duration-200"
              >
                <span>Copy Config</span>
              </button>
            </div>
            <button
              onClick={() => setIsEditorOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-accent-orange hover:bg-accent-cream hover:text-surface-primary text-surface-primary rounded-xl font-medium text-xs transition-colors duration-200"
            >
              <span>Save &amp; Close</span>
            </button>
          </div>
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-text-secondary hidden md:block cursor-pointer"
        onClick={() => scrollTo('#about')}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase mb-1">Scroll Down</span>
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>

    </section>
  );
}
