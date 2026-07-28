'use client';

import { useEffect, useRef } from 'react';

const TAGS = [
  'Problem Solver',
  'Open Source',
  'AI Enthusiast',
  'Team Leader',
  'Clean Code',
  'Agile',
];

const STATS = [
  { value: 10, suffix: '+', label: 'Projects Built' },
  { value: 2, suffix: '', label: 'Internships' },
  { value: 20, suffix: '+', label: 'Technologies' },
];

/**
 * About section featuring GSAP ScrollTrigger animations, SplitText line reveals,
 * proxy-object animated counters, and batch-staggered trait pills.
 */
export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let ctx: any = null;

    const initGSAP = async () => {
      try {
        const { gsap, ScrollTrigger, SplitText } = await import('@/app/lib/gsap');

        ctx = gsap.context(() => {
          // 1. Header entrance
          gsap.from('#about-heading', {
            opacity: 0,
            y: 25,
            duration: 0.7,
            scrollTrigger: {
              trigger: '#about-heading',
              start: 'top 85%',
              once: true,
            },
          });

          // 2. Quote SplitText line reveal (using built-in { type: "lines", mask: "lines" })
          const quoteSplit = new SplitText('.about-quote-text', {
            type: 'lines',
            mask: 'lines',
          });

          if (quoteSplit.lines) {
            gsap.from(quoteSplit.lines, {
              opacity: 0,
              y: 30,
              stagger: 0.1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: '.about-quote',
                start: 'top 80%',
                once: true,
              },
            });
          }

          // 3. Bio paragraphs
          gsap.from('.about-bio-p', {
            opacity: 0,
            y: 20,
            stagger: 0.15,
            duration: 0.7,
            scrollTrigger: {
              trigger: '.about-bio',
              start: 'top 80%',
              once: true,
            },
          });

          // 4. Divider line
          gsap.from('.about-divider', {
            scaleX: 0,
            duration: 0.8,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: '.about-divider',
              start: 'top 85%',
              once: true,
            },
          });

          // 5. Trait pills batch stagger
          gsap.from('.about-tag', {
            opacity: 0,
            y: 12,
            scale: 0.9,
            stagger: 0.06,
            duration: 0.5,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: '.about-tags',
              start: 'top 85%',
              once: true,
            },
          });

          // 6. Stat Counters (GSAP proxy object — fixes 0+ rendering bug)
          STATS.forEach((stat, i) => {
            const el = statRefs.current[i];
            if (!el) return;

            const proxy = { val: 0 };
            gsap.to(proxy, {
              val: stat.value,
              duration: 1.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                once: true,
              },
              onUpdate: () => {
                if (el) {
                  el.textContent = `${Math.floor(proxy.val)}${stat.suffix}`;
                }
              },
            });
          });

          // 7. Currently At card entrance
          gsap.from('.about-card', {
            opacity: 0,
            y: 30,
            duration: 0.7,
            scrollTrigger: {
              trigger: '.about-card',
              start: 'top 85%',
              once: true,
            },
          });
        }, sectionRef);
      } catch (err) {
        console.error('About GSAP init error:', err);
      }
    };

    initGSAP();

    return () => {
      ctx?.revert();
    };
  }, []);

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
            <h2 id="about-heading" className="about-title">
              About <em>Me</em>
            </h2>
          </div>
        </div>

        <div className="about-grid">
          {/* Left Column: Biography */}
          <div className="about-left">
            {/* Highlighted Quote Block */}
            <div className="about-quote">
              <blockquote className="about-quote-text">
                "I build things that live at the intersection of clean code and intuitive design — solving real problems with elegant solutions."
              </blockquote>
            </div>

            {/* Paragraphs */}
            <div className="about-bio">
              <p className="about-bio-p">
                I'm a Computer Science graduate from <strong className="font-semibold">Amritsar Group of Colleges</strong> with 10 months of production experience building internal automation platforms, AI-integrated workflows, and enterprise REST APIs at Rubrik.
              </p>
              <p className="about-bio-p">
                I build custom Claude AI agents and integrations using Glean's Model Context Protocol (MCP) servers, alongside Zapier automation workflows, to drive engineering productivity. I'm highly motivated by developer experience, cloud-native backend tooling, and robust integrations.
              </p>
            </div>

            {/* Divider line */}
            <div className="about-divider origin-left" />

            {/* Tag Pills */}
            <div
              className="about-tags"
              aria-label="Personal traits and methodology"
            >
              {TAGS.map((tag) => (
                <span key={tag} className="about-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Statistics & Current Info Card */}
          <div className="about-right">
            {/* Large background vertical text */}
            <span className="about-ambient-text" aria-hidden="true">About</span>

            {/* Stats Stack */}
            <div className="about-stats">
              {STATS.map((stat, i) => (
                <div key={stat.label} className="about-stat-item">
                  <div className="about-stat-num">
                    <span ref={(el) => { statRefs.current[i] = el; }}>0{stat.suffix}</span>
                  </div>
                  <div className="about-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Currently At Card */}
            <div className="about-card">
              <div className="about-card-eyebrow">Currently At</div>
              <h3 className="about-card-title">Rubrik, Inc.</h3>
              <p className="about-card-desc">Enterprise Integration Engineer Intern</p>
              <div className="about-card-badge" role="status" aria-label="Employment status">
                <span className="about-card-badge-dot" aria-hidden="true" />
                <span>Active Intern</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
