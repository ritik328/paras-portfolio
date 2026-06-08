'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

interface Stat {
  label: string;
  value: string;
  numericValue?: number;
}

const stats: Stat[] = [
  { label: 'Projects Built', value: '10+', numericValue: 10 },
  { label: 'Internships', value: '2', numericValue: 2 },
  { label: 'Technologies', value: '20+', numericValue: 20 },
];

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
    return spring.onChange((latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest) + suffix;
      }
    });
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/**
 * About section with 60/40 asymmetric grid layout, biography, and animated statistics.
 */
export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      className="py-[120px] max-sm:py-[60px] bg-[#0d0d0c]"
      aria-labelledby="about-heading"
    >
      <div className="max-w-[1200px] mx-auto px-20 max-md:px-6" ref={sectionRef}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          id="about-heading"
          className="text-section-heading text-[#f0ede6] mb-16"
        >
          About Me
        </motion.h2>

        <div className="grid md:grid-cols-[60%_40%] gap-12 items-start about-bio">
          {/* Biography - Left 60% */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="font-serif text-lg md:text-xl text-[#f0ede6] leading-relaxed mb-6">
              I&apos;m a passionate Full-Stack Developer currently pursuing B.Tech in Computer
              Science at Amritsar Group of Colleges. I love building web applications that solve
              real-world problems with clean code and intuitive design.
            </p>
            <p className="font-serif text-lg text-[#888884] leading-relaxed mb-6">
              My journey in tech spans across the full stack — from crafting pixel-perfect
              frontends with React.js to building robust backends with Django and Node.js.
              I&apos;ve also explored the world of AI tools and how they can supercharge
              developer productivity.
            </p>
            <p className="font-serif text-lg text-[#888884] leading-relaxed">
              When I&apos;m not coding, I&apos;m exploring new technologies, contributing to
              open-source projects, and constantly learning to stay ahead in the ever-evolving
              tech landscape.
            </p>

            {/* Accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 h-px bg-gradient-to-r from-[#e07040] to-transparent origin-left"
            />
          </motion.div>

          {/* Statistics - Right 40% */}
          <div className="space-y-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                className="group"
              >
                <div className="text-5xl font-serif text-[#e07040] mb-2 tabular-nums">
                  {stat.numericValue !== undefined ? (
                    <AnimatedCounter
                      value={stat.numericValue}
                      suffix={stat.value.replace(/\d+/, '')}
                    />
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-[#888884] font-sans text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
                <div className="mt-3 h-px bg-[#3a3a38] group-hover:bg-[#e07040] transition-colors duration-300" />
              </motion.div>
            ))}

            {/* College info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="text-sm text-[#888884] uppercase tracking-wider mb-1">Currently At</div>
              <div className="text-[#f0ede6] font-medium">Amritsar Group of Colleges</div>
              <div className="text-[#888884] text-sm">B.Tech CSE · 2022 – 2026</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
