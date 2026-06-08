"use client";

// ─── Data ──────────────────────────────────────────────────────────────────────
// Edit this array to update your experience entries.
const EXPERIENCES = [
  {
    index: "01",
    role: "Summer Intern",
    company: "Bharat Electronics Limited (BEL)",
    type: "Defence PSU",
    period: "Jun 2024 — Jul 2024",
    summary:
      "Led full-stack development of BEL's homepage using Django and Tailwind CSS. Developed multilingual site features, dynamic navigation menus, and a secure admin panel.",
    bullets: [
      "Built and deployed a multilingual Django site with dynamic navigation menus",
      "Designed secure admin panel for content management with role-based access",
      "Coordinated team efforts using ChatGPT and Notion AI for code generation and planning",
      "Implemented Tailwind CSS design system with responsive layouts across devices",
    ],
    tags: ["Django", "Tailwind CSS", "Python", "HTML / CSS", "Notion AI", "Team Lead"],
  },
  {
    index: "02",
    role: "Trainee Developer",
    company: "Evon Technologies",
    type: "Software Agency",
    period: "Jun 2024 — Jul 2024",
    summary:
      "Developed full-stack web applications using the MERN stack and gained hands-on experience in agile development practices and RESTful API design.",
    bullets: [
      "Built RESTful APIs using Node.js and Express.js with MongoDB integration",
      "Developed responsive React components using modern hooks and state management",
      "Implemented MongoDB database schemas and optimised query performance",
      "Participated in agile sprints, daily stand-ups and Git-based code reviews",
    ],
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "Git", "Agile"],
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export function Experience() {
  return (
    <section id="experience" className="exp-section">
      {/* Dot-grid atmosphere */}
      <div className="exp-bg" aria-hidden="true" />

      {/* Header */}
      <div className="exp-header">
        <p className="exp-eyebrow">Career Path</p>
        <h2 className="exp-title">
          Work <em>Experience</em>
        </h2>
        <p className="exp-count">{EXPERIENCES.length.toString().padStart(2, "0")} positions · 2024</p>
      </div>

      {/* Timeline list */}
      <ol className="exp-list">
        {EXPERIENCES.map((exp, i) => (
          <li key={exp.index} className="exp-item">
            {/* Left index column */}
            <div className="exp-index-col" aria-hidden="true">
              <span className="exp-num">{exp.index}</span>
              <span className="exp-dot" />
              {i < EXPERIENCES.length - 1 && <span className="exp-vline" />}
            </div>

            {/* Card */}
            <article className="exp-card">
              {/* Top row: role + date */}
              <div className="exp-card-top">
                <h3 className="exp-role">{exp.role}</h3>
                <div className="exp-date-badge">
                  <span className="exp-date-dot" aria-hidden="true" />
                  <time className="exp-date">{exp.period}</time>
                </div>
              </div>

              {/* Company + type */}
              <div className="exp-company-row">
                <span className="exp-company">{exp.company}</span>
                <span className="exp-company-sep" aria-hidden="true" />
                <span className="exp-type">{exp.type}</span>
              </div>

              {/* Divider */}
              <div className="exp-divider" aria-hidden="true" />

              {/* Summary */}
              <p className="exp-summary">{exp.summary}</p>

              {/* Bullet points */}
              <ul className="exp-bullets">
                {exp.bullets.map((bullet, bi) => (
                  <li key={bi} className="exp-bullet">
                    <div className="exp-bullet-marker" aria-hidden="true">
                      <span className="exp-bullet-line" />
                      <span className="exp-bullet-tip" />
                    </div>
                    <span className="exp-bullet-text">{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Tech tags */}
              <div className="exp-tags" aria-label="Technologies used">
                {exp.tags.map((tag) => (
                  <span key={tag} className="exp-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
