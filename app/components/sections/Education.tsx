'use client';

import { useEffect, useRef } from 'react';
import { Clock, Award } from 'lucide-react';
import { education, certifications } from '@/app/lib/data/education';

/**
 * Education & Certifications section with clean GSAP ScrollTrigger animations.
 * Intentionally quiet, subtle entrance animations.
 */
export function Education() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: any = null;

    const initGSAP = async () => {
      try {
        const { gsap } = await import('@/app/lib/gsap');

        ctx = gsap.context(() => {
          // 1. Header
          gsap.from('#education-heading', {
            opacity: 0,
            y: 20,
            duration: 0.6,
            scrollTrigger: {
              trigger: '#education-heading',
              start: 'top 85%',
              once: true,
            },
          });

          // 2. Timeline entries
          gsap.from('.edu-entry', {
            opacity: 0,
            y: 25,
            stagger: 0.15,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.edu-timeline',
              start: 'top 80%',
              once: true,
            },
          });

          // 3. Credentials grid items
          gsap.from('.cert-item', {
            opacity: 0,
            y: 15,
            stagger: 0.06,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.cert-grid',
              start: 'top 85%',
              once: true,
            },
          });
        }, sectionRef);
      } catch (err) {
        console.error('Education GSAP init error:', err);
      }
    };

    initGSAP();

    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="education"
      ref={sectionRef}
      className="edu-section"
      aria-labelledby="education-heading"
    >
      {/* Grid Pattern Background */}
      <div className="edu-bg" />

      <div className="max-w-[1200px] mx-auto px-20 max-md:px-6">
        {/* Section Header */}
        <div className="edu-header">
          <p className="edu-eyebrow">Academic Journey</p>
          <h2 id="education-heading" className="edu-title">
            Education &amp; <em>Certifications</em>
          </h2>
        </div>

        {/* Academic Timeline */}
        <ol className="edu-timeline">
          {education.map((edu) => (
            <li key={edu.id} className="edu-entry">
              {/* Left Column Year Marker */}
              <div className="edu-marker">
                <span className="edu-year">{edu.year}</span>
                <span className="edu-marker-dot" />
              </div>

              {/* Card Container */}
              <div className="edu-card">
                <div className="edu-card-head">
                  <h3 className="edu-degree">{edu.degree}</h3>
                  {edu.score && (
                    <div className="edu-score">
                      <span className="edu-score-num">{edu.score}</span>
                      <span className="edu-score-label">Score</span>
                    </div>
                  )}
                </div>
                <p className="edu-school">{edu.institution}</p>
                <p className="edu-desc">{edu.description}</p>

                {/* Status indicator for active enrollment */}
                {edu.id === 'btech' && (
                  <div className="edu-status">
                    <span className="edu-status-dot" />
                    <span className="edu-status-text">Currently Enrolled</span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>

        {/* Certifications Block */}
        <div className="cert-section">
          <div className="cert-header">
            <h3 className="cert-title">Professional Credentials</h3>
            <div className="cert-line" />
            <span className="cert-count">{certifications.length} TOTAL</span>
          </div>

          <ul className="cert-grid">
            {certifications.map((cert) => (
              <li key={cert.id} className="cert-item">
                {/* Custom Icon Box */}
                <div className="cert-icon">
                  {cert.status === 'completed' ? (
                    <Award size={14} className="text-accent-orange" />
                  ) : (
                    <Clock size={14} className="text-accent-orange" />
                  )}
                </div>

                {/* Certificate info */}
                <div className="cert-info">
                  <h4 className="cert-name" title={cert.name}>
                    {cert.name}
                  </h4>
                  <p className="cert-provider">{cert.issuer}</p>
                </div>

                {/* Completion / Ongoing Badge */}
                <span
                  className={`cert-badge ${
                    cert.status === 'completed' ? 'done' : 'ongoing'
                  }`}
                >
                  {cert.status === 'completed' ? cert.completionDate ?? 'Done' : 'Ongoing'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
