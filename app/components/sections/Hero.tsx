'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Send, Settings, RotateCcw, X, Sliders } from 'lucide-react';
import { useSmoothScroll } from '@/app/lib/hooks/useSmoothScroll';
import { InteractiveMap } from '@/app/components/canvas/InteractiveMap';

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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const isOverflowRight = mousePos.x + 220 > windowWidth;
  const leftPos = isOverflowRight ? mousePos.x - 212 : mousePos.x + 20;

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
          className="flex flex-col justify-center text-left"
          style={{
            transform: mounted
              ? `translate(${settings.textX}px, ${settings.textY}px) scale(${settings.textScale})`
              : undefined,
            transformOrigin: 'left center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="text-accent-orange font-mono text-sm tracking-wider uppercase mb-3 block font-semibold">
              Available for Opportunities
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="text-hero text-text-primary mb-4 tracking-tight cursor-pointer select-none hover:text-accent-orange transition-colors duration-300"
            onClick={handleTitleClick}
            onMouseEnter={() => setIsTitleHovered(true)}
            onMouseLeave={() => setIsTitleHovered(false)}
            onMouseMove={handleMouseMove}
            title="Triple click to open layout editor"
          >
            Paras Negi
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="text-xl md:text-2xl text-accent-cream font-serif mb-5"
          >
            Full-Stack Developer
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: 'easeOut' }}
            className="text-text-secondary text-base md:text-lg mb-8 leading-relaxed max-w-xl"
          >
            I build elegant, high-performance web applications with robust backends and interactive user interfaces.
            Explore my interactive skills web to see my technical toolkit in action.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {['Python', 'React.js', 'Django', 'Node.js', 'MERN Stack'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-mono bg-surface-secondary text-text-secondary rounded-full border border-border"
              >
                {tech}
              </span>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => scrollTo('#projects')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-orange text-surface-primary rounded-xl hover:bg-accent-cream transition-all duration-300 font-medium text-sm hover:translate-y-[-2px] shadow-lg shadow-accent-orange/10"
            >
              <span>View My Work</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => scrollTo('#contact')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface-secondary text-text-primary border border-border hover:border-accent-orange hover:text-accent-orange transition-all duration-300 font-medium text-sm hover:translate-y-[-2px]"
            >
              <span>Get in Touch</span>
              <Send size={14} />
            </button>
          </motion.div>
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

      <AnimatePresence>
        {isTitleHovered && (
          <motion.div
            style={{
              position: 'fixed',
              left: leftPos,
              top: mousePos.y - 120,
              pointerEvents: 'none',
              zIndex: 9999,
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 2 }}
            exit={{ opacity: 0, scale: 0.8, y: -10, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="w-48 h-64 rounded-2xl border-2 border-accent-orange overflow-hidden bg-surface-secondary shadow-2xl shadow-accent-orange/30"
          >
            {/* Grid Lines Pattern */}
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none z-10" />
            <img
              src="/paras.jpg"
              alt="Paras Negi"
              className="w-full h-full object-cover filter contrast-[1.05] brightness-[0.95]"
            />
            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
