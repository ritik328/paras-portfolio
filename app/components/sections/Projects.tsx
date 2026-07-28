'use client';

import { useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { projects } from '@/app/lib/data/projects';
import type { Project } from '@/app/lib/data/types';

// SVG GitHub icon (matching the rest of the project)
function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: Project;
  index: number;
  featured?: boolean;
}) {
  const formattedIndex = String(index + 1).padStart(2, '0');

  return (
    <div className={`proj-card ${featured ? 'featured' : ''}`}>
      {/* Card Header area */}
      {featured ? (
        <div className="proj-card-head">
          <span className="proj-card-badge">
            <span className="proj-card-badge-dot" />
            Featured Project
          </span>
          <span className="proj-card-index">{formattedIndex}</span>
        </div>
      ) : (
        <div className="mb-4">
          <span className="proj-card-index">{formattedIndex}</span>
        </div>
      )}

      {/* Project Title */}
      <h3 className="proj-card-title">{project.name}</h3>

      {/* Project Description */}
      <p className="proj-card-desc">{project.description}</p>

      {/* Tech Tags */}
      <div className="proj-card-tags">
        {project.tags.map((tag) => (
          <span key={tag} className="proj-card-tag">
            {tag}
          </span>
        ))}
      </div>

      {/* Project Links */}
      <div className="proj-card-links">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="proj-card-link"
            aria-label={`View ${project.name} code on GitHub`}
          >
            <GithubIcon size={14} />
            <span>Code</span>
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="proj-card-link"
            aria-label={`View ${project.name} live demo`}
          >
            <ExternalLink size={14} />
            <span>Live Demo</span>
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * Projects section displaying featured and regular projects.
 */
export function Projects() {
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: any = null;

    const initAnimations = async () => {
      try {
        const { gsap, Flip } = await import('@/app/lib/gsap');

        ctx = gsap.context(() => {
          // Section heading reveal
          gsap.from('#projects-heading', {
            opacity: 0,
            y: 24,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '#projects-heading',
              start: 'top 85%',
              once: true,
            },
          });

          gsap.from('.proj-eyebrow', {
            opacity: 0,
            y: 15,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.proj-header',
              start: 'top 85%',
              once: true,
            },
          });

          // Featured cards — slower, larger scale-in
          gsap.from('.proj-card.featured', {
            opacity: 0,
            y: 40,
            scale: 0.95,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.proj-card.featured',
              start: 'top 80%',
              once: true,
            },
          });

          // Regular cards — tighter stagger
          gsap.from('.proj-card:not(.featured)', {
            opacity: 0,
            y: 30,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.proj-card:not(.featured)',
              start: 'top 80%',
              once: true,
            },
          });

          // Flip infrastructure (future-proof): a future filter UI can call
          //   const state = Flip.getState('.proj-card');
          //   setFilter(next);
          //   requestAnimationFrame(() => Flip.from(state, { duration: 0.6, ease: 'power2.inOut' }));
          // to animate card reordering instead of a jump-cut.
          if (gridRef.current) {
            (gridRef.current as any).__flipCapture = () =>
              Flip.getState('.proj-card');
          }
        }, sectionRef);
      } catch (err) {
        console.error('GSAP projects init error:', err);
      }
    };

    initAnimations();

    return () => {
      ctx?.revert();
    };
  }, []);

  // Filter projects
  const featuredProjects = projects.filter((p) => p.featured);
  const regularProjects = projects.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="proj-section"
      aria-labelledby="projects-heading"
    >
      {/* Blueprint grid background */}
      <div className="proj-bg" />

      <div className="max-w-[1200px] mx-auto px-20 max-md:px-6">
        {/* Section Header */}
        <div className="proj-header">
          <p className="proj-eyebrow">Selected Work</p>
          <h2 id="projects-heading" className="proj-title">
            Built <em>Projects</em>
          </h2>
        </div>

        {/* Projects Layout Grid */}
        <div ref={gridRef} className="proj-grid">
          {/* Featured projects - full width */}
          {featuredProjects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} featured />
          ))}

          {/* Regular projects - 2 column grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {regularProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={featuredProjects.length + idx}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
