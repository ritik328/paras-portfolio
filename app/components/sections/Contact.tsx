'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Copy } from 'lucide-react';
import { Toast } from '@/app/components/ui/Toast';

const EMAIL = 'parasnegi783@gmail.com';

// SVG icons for social links (brand icons not in lucide-react)
function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function LinkedinIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const socialLinks = [
  {
    id: 'linkedin',
    href: 'https://linkedin.com/in/parasnegi783',
    label: 'Visit LinkedIn profile',
    Icon: LinkedinIcon,
    name: 'LinkedIn',
  },
  {
    id: 'github',
    href: 'https://github.com/parasnegi783',
    label: 'Visit GitHub profile',
    Icon: GithubIcon,
    name: 'GitHub',
  },
];

/**
 * Contact section with clipboard copy functionality and toast notification.
 */
export function Contact() {
  const [showToast, setShowToast] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const handleEmailCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setShowToast(true);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = EMAIL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowToast(true);
    }
  };

  return (
    <>
      <section
        id="contact"
        ref={sectionRef}
        className="py-[120px] max-sm:py-[60px] bg-[#0d0d0c]"
        aria-labelledby="contact-heading"
      >
        <div className="max-w-[1200px] mx-auto px-20 max-md:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            id="contact-heading"
            className="text-section-heading text-[#f0ede6] mb-6"
          >
            Let&apos;s Work Together
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-xl text-[#888884] mb-4 max-w-2xl mx-auto"
          >
            I&apos;m currently open to freelance opportunities and full-time positions.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[#888884] mb-12"
          >
            <a
              href={`mailto:${EMAIL}`}
              className="text-[#c8b89a] hover:text-[#e07040] transition-colors font-mono text-sm"
            >
              {EMAIL}
            </a>
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10"
          >
            {/* Copy email button */}
            <button
              onClick={handleEmailCopy}
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#e07040] text-[#0d0d0c] rounded-xl hover:bg-[#c8b89a] transition-colors duration-300 font-medium text-sm group"
              aria-label="Copy email address to clipboard"
            >
              <Mail size={18} />
              <span>Copy Email Address</span>
              <Copy size={14} className="opacity-60 group-hover:opacity-100" />
            </button>

            {/* Social links */}
            {socialLinks.map((social) => {
              const { Icon } = social;
              return (
                <motion.a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#1a1a18] border border-[#3a3a38] rounded-xl hover:border-[#e07040] hover:text-[#e07040] text-[#888884] transition-colors duration-300 text-sm font-medium"
                  aria-label={social.label}
                >
                  <Icon size={18} />
                  <span>{social.name}</span>
                </motion.a>
              );
            })}
          </motion.div>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="max-w-xs mx-auto h-px bg-gradient-to-r from-transparent via-[#3a3a38] to-transparent origin-center"
          />
        </div>
      </section>

      {/* Toast notification */}
      <Toast
        message="Email copied to clipboard!"
        visible={showToast}
        onDismiss={() => setShowToast(false)}
      />
    </>
  );
}
