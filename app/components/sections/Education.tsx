'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';
import { education, certifications } from '@/app/lib/data/education';

/**
 * Education section displaying academic background and certifications.
 */
export function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="education"
      ref={sectionRef}
      className="py-[120px] max-sm:py-[60px] bg-[#1a1a18]"
      aria-labelledby="education-heading"
    >
      <div className="max-w-[1200px] mx-auto px-20 max-md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          id="education-heading"
          className="text-section-heading text-[#f0ede6] mb-16"
        >
          Education &amp; Certifications
        </motion.h2>

        {/* Education Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-14">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.15 }}
              className="bg-[#0d0d0c] rounded-xl p-6 border border-[#3a3a38] hover:border-[#e07040]/50 transition-colors duration-300 group"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-sans font-bold text-[#f0ede6] group-hover:text-[#e07040] transition-colors leading-tight">
                  {edu.degree}
                </h3>
                {edu.score && (
                  <span className="shrink-0 px-2.5 py-1 bg-[#e07040]/10 text-[#e07040] text-xs font-bold rounded-lg border border-[#e07040]/30">
                    {edu.score}
                  </span>
                )}
              </div>
              <p className="text-[#e07040] font-medium mb-2">{edu.institution}</p>
              <p className="text-sm text-[#888884] font-mono">{edu.year}</p>
              {edu.description && (
                <p className="mt-3 text-sm text-[#888884] leading-relaxed">{edu.description}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-2xl font-serif text-[#f0ede6] mb-6">Certifications</h3>
          <div className="flex flex-wrap gap-3" role="list">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.08 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors duration-200 ${
                  cert.status === 'completed'
                    ? 'bg-[#0d1a0d] text-green-400 border-green-800 hover:border-green-600'
                    : 'bg-[#1a1a0d] text-yellow-400 border-yellow-800 hover:border-yellow-600'
                }`}
                role="listitem"
              >
                {cert.status === 'completed' ? (
                  <CheckCircle size={14} aria-label="Completed" />
                ) : (
                  <Clock size={14} aria-label="In progress" />
                )}
                <span>{cert.name}</span>
                <span className="text-xs opacity-60">· {cert.issuer}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
