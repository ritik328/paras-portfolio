'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

/**
 * Toast notification component with auto-dismiss and slide-in animation.
 */
export function Toast({ message, visible, onDismiss, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss, duration]);

  return (
    <div
      className="fixed bottom-8 right-8 z-[100]"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex items-center gap-3 px-5 py-3 bg-[#1a1a18] border border-[#e07040] rounded-xl shadow-xl"
            role="alert"
          >
            <CheckCircle size={18} className="text-[#e07040] shrink-0" />
            <p className="text-[#f0ede6] text-sm font-medium">{message}</p>
            <button
              onClick={onDismiss}
              className="ml-2 text-[#888884] hover:text-[#f0ede6] transition-colors"
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
