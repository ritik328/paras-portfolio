'use client';

import { useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { projects } from '@/app/lib/data/projects';
import type { Project } from '@/app/lib/data/types';

// SVG GitHub icon (not in newer lucide-react)
function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <div
      className={`project-card group relative bg-[#1a1a18] rounded-xl p-6 border border-[#3a3a38] 
                  hover:border-[#e07040] transition-all duration-300 hover:-translate-y-1 ${
                    featured ? 'md:p-8' : ''
                  }`}
    >
      {featured && (
        <span className="inline-block px-3 py-1 bg-[#e07040]/10 text-[#e07040] text-xs font-medium rounded-full border border-[#e07040]/30 mb-4">
          Featured Project
        </span>
      )}

      <h3
        className={`font-sans font-bold text-[#f0ede6] mb-3 group-hover:text-[#e07040] transition-colors ${
          featured ? 'text-2xl' : 'text-xl'
        }`}
      >
        {project.name}
      </h3>

      <p className="text-[#888884] mb-4 leading-relaxed text-sm">{project.description}</p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs bg-[#2a2a28] text-[#888884] rounded-full border border-[#3a3a38]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-4">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#888884] hover:text-[#e07040] transition-colors duration-200"
            aria-label={`View ${project.name} on GitHub`}
          >
            <GithubIcon size={16} />
            <span>Code</span>
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#888884] hover:text-[#e07040] transition-colors duration-200"
            aria-label={`View ${project.name} live demo`}
          >
            <ExternalLink size={16} />
            <span>Live Demo</span>
          </a>
        )}
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: '0 0 30px rgba(224, 112, 64, 0.15)' }}
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * Projects section with masonry card grid layout and GSAP stagger animations.
 */
export function Projects() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initAnimations = async () => {
      try {
        const gsapModule = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsapModule.default.registerPlugin(ScrollTrigger);

        if (!gridRef.current) return;

        gsapModule.default.fromTo(
          '.project-card',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 70%',
            },
          }
        );
      } catch (err) {
        console.error('GSAP init error:', err);
      }
    };

    initAnimations();
  }, []);

  const featuredProjects = projects.filter((p) => p.featured);
  const regularProjects = projects.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      className="py-[120px] max-sm:py-[60px] bg-[#0d0d0c]"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-[1200px] mx-auto px-20 max-md:px-6">
        <h2
          id="projects-heading"
          className="text-section-heading text-[#f0ede6] mb-16"
        >
          Projects
        </h2>

        <div ref={gridRef} className="space-y-6">
          {/* Featured projects - full width */}
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} featured />
          ))}

          {/* Regular projects - 2 column grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {regularProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
