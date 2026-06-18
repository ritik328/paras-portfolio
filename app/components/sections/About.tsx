'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 100, damping: 15 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    return spring.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest) + suffix;
      }
    });
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const TAGS = [
  'Problem Solver',
  'Open Source',
  'AI Enthusiast',
  'Team Leader',
  'Clean Code',
  'Agile',
];

/**
 * About section with premium asymmetric layout, vertical ambient text,
 * highlighted biography quote, skills chips, and interactive statistics.
 */
export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      className="about-section"
      aria-labelledby="about-heading"
      ref={sectionRef}
    >
      {/* Background blueprint grid overlay */}
      <div className="about-bg" />

      <div className="about-container">
        {/* Section Header */}
        <div className="about-header">
          <div>
            <p className="about-eyebrow">Who I Am</p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              id="about-heading"
              className="about-title"
            >
              About <em>Me</em>
            </motion.h2>
          </div>
        </div>

        <div className="about-grid">
          {/* Left Column: Biography */}
          <div className="about-left">
            {/* Highlighted Quote Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="about-quote"
            >
              <blockquote className="about-quote-text">
                "I build things that live at the intersection of clean code and intuitive design — solving real problems with elegant solutions."
              </blockquote>
            </motion.div>

            {/* Paragraphs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="about-bio"
            >
              <p className="about-bio-p">
                I'm a Computer Science graduate from <strong className="font-semibold">Amritsar Group of Colleges</strong> with 10 months of production experience building internal automation platforms, AI-integrated workflows, and enterprise REST APIs at Rubrik.
              </p>
              <p className="about-bio-p">
                I build custom Claude AI agents and integrations using Glean's Model Context Protocol (MCP) servers, alongside Zapier automation workflows, to drive engineering productivity. I'm highly motivated by developer experience, cloud-native backend tooling, and robust integrations.
              </p>
            </motion.div>

            {/* Divider line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="about-divider origin-left"
            />

            {/* Tag Pills */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="about-tags"
              aria-label="Personal traits and methodology"
            >
              {TAGS.map((tag) => (
                <span key={tag} className="about-tag">
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Statistics & Current Info Card */}
          <div className="about-right">
            {/* Large background vertical text */}
            <span className="about-ambient-text" aria-hidden="true">About</span>

            {/* Stats Stack */}
            <div className="about-stats">
              {/* Stat 1 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="about-stat-item"
              >
                <div className="about-stat-num">
                  <AnimatedCounter value={10} /><em>+</em>
                </div>
                <div className="about-stat-label">Projects Built</div>
              </motion.div>

              {/* Stat 2 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="about-stat-item"
              >
                <div className="about-stat-num">
                  <AnimatedCounter value={2} />
                </div>
                <div className="about-stat-label">Internships</div>
              </motion.div>

              {/* Stat 3 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="about-stat-item"
              >
                <div className="about-stat-num">
                  <AnimatedCounter value={20} /><em>+</em>
                </div>
                <div className="about-stat-label">Technologies</div>
              </motion.div>
            </div>

            {/* Currently At Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="about-card"
            >
              <div className="about-card-eyebrow">Currently At</div>
              <h3 className="about-card-title">Rubrik, Inc.</h3>
              <p className="about-card-desc">Enterprise Integration Engineer Intern</p>
              <div className="about-card-badge" role="status" aria-label="Employment status">
                <span className="about-card-badge-dot" aria-hidden="true" />
                <span>Active Intern</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
