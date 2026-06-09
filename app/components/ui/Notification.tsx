'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSmoothScroll } from '@/app/lib/hooks/useSmoothScroll';

// Close Icon SVG (inline, zero deps)
function IconClose() {
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" fill="none"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// Custom Speech Bubble Icon SVG (inline, matching standard Messages app)
function IconSpeechBubble({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M15 4C8.5 4 3 8.5 3 15C3 17.5 4 19.8 5.5 21.5L3.5 26.5L8.5 24.5C10.2 25.5 12.5 26 15 26C21.5 26 27 21.5 27 15C27 8.5 21.5 4 15 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Premium interactive iOS-style notification component.
 * Slides into bottom-right viewport after 3 seconds.
 * Supports swiping hover interaction to reveal a "Say Hi" action button.
 * Fully theme-aware (Light/Dark mode compatible).
 */
export function Notification() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    // Show notification after 3-second delay if not previously dismissed
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isDismissed]);

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    scrollTo('#contact');
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    setIsDismissed(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="ios-notify-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Revealed Swipe Action Button */}
          <button
            onClick={handleActionClick}
            className="ios-notify-action-btn"
            aria-label="Scroll to contact section and say hi"
          >
            <span className="ios-notify-action-text">Say Hi</span>
          </button>

          {/* Foreground Notification Card */}
          <div
            onClick={handleActionClick}
            className={`ios-notify-card cursor-pointer ${
              isHovered ? 'swipe-active' : ''
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && scrollTo('#contact')}
          >
            {/* App Icon Bubble */}
            <div className="ios-notify-icon-container">
              <IconSpeechBubble size={22} />
            </div>

            {/* Notification Copy Details */}
            <div className="ios-notify-body">
              <span className="ios-notify-appname">Paras Negi</span>
              <span className="ios-notify-message">
                Hey! Thanks for visiting. Feel free to connect or drop a message! ✉️
              </span>
            </div>

            {/* Time stamps & Dismiss triggers */}
            <div className="ios-notify-meta">
              <span className="ios-notify-time">now</span>
              <button
                onClick={handleDismiss}
                className="ios-notify-close-btn"
                aria-label="Dismiss notification card"
              >
                <IconClose />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
