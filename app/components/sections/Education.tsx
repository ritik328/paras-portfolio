'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle, Clock, Award, GraduationCap } from 'lucide-react';
import { education, certifications } from '@/app/lib/data/education';

/**
 * Education & Certifications section displaying academic timeline and credentials.
 * Implements a premium blueprint schematic vertical timeline layout.
 */
export function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

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
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            id="education-heading"
            className="edu-title"
          >
            Education &amp; <em>Certifications</em>
          </motion.h2>
        </div>

        {/* Academic Timeline */}
        <ol className="edu-timeline">
          {education.map((edu, index) => (
            <motion.li
              key={edu.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.15 }}
              className="edu-entry"
            >
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
            </motion.li>
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
            {certifications.map((cert, index) => (
              <motion.li
                key={cert.id}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.06 }}
                className="cert-item"
              >
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
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
