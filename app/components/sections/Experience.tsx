"use client";

import { useEffect, useRef } from "react";

// --- Data ----------------------------------------------------------------------
const EXPERIENCES = [
  {
    index: "01",
    role: "Enterprise Integration Engineer Intern",
    company: "Rubrik, Inc.",
    type: "Enterprise Cloud Security",
    period: "Aug 2025 - Present",
    status: "active",
    summary:
      "Building internal automation platforms, AI-integrated workflows, and enterprise REST APIs. Administering Zapier and Glean AI platforms and building custom Claude AI agents.",
    bullets: [
      "Administered Zapier and Glean AI platforms for the engineering org to configure AI agents and onboard teams",
      "Built custom Claude AI agents to automate dev tasks, including a MuleSoft metadata to Confluence documentation generator",
      "Developed Slack-Jira automation bots (Facilities Request Router and CPQ Responder) using Glean's MCP server over Streamable HTTP with bidirectional thread sync",
      "Designed a Team Productivity Analytics Platform with dashboards for a 100+ person IT org, reducing JVM heap footprint by 69% (85MB to 26MB)",
      "Built a SOX Compliance Audit Automation suite traversing Anypoint org trees via Management APIs, eliminating 15+ hours of manual quarterly effort",
      "Developed high-performance backend integrations including Okta Worker Data API (RFC 5988 pagination) and Salesforce-LinkedIn Conversions API",
    ],
    tags: [
      "MuleSoft 4",
      "Python",
      "Claude AI (MCP)",
      "Glean AI",
      "Anypoint MQ",
      "Jira API",
      "Workday API",
      "Okta API",
      "CloudHub 2.0",
    ],
  },
  {
    index: "02",
    role: "Summer Intern",
    company: "Bharat Electronics Limited (BEL)",
    type: "Defence PSU",
    period: "Jun 2024 - Jul 2024",
    status: "past",
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
    index: "03",
    role: "Trainee Developer",
    company: "Evon Technologies",
    type: "Software Agency",
    period: "Jun 2024 - Jul 2024",
    status: "past",
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

// --- Component -----------------------------------------------------------------
export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const indicatorBarRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      try {
        const gsap = (await import("gsap")).default;
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);

        const section = sectionRef.current;
        const panels = panelsRef.current;
        const bar = indicatorBarRef.current;
        if (!section || !panels || !bar) return;

        const panelEls = panels.querySelectorAll<HTMLElement>(".exp-panel");

        // Helper: update left nav highlight + indicator bar
        const setActive = (index: number) => {
          activeIndexRef.current = index;

          navItemRefs.current.forEach((btn, i) => {
            if (!btn) return;
            btn.classList.toggle("is-active", i === index);
          });

          const activeBtn = navItemRefs.current[index];
          if (activeBtn && bar) {
            const btnTop = activeBtn.offsetTop;
            const btnHeight = activeBtn.offsetHeight;
            gsap.to(bar, {
              top: btnTop,
              height: btnHeight,
              duration: 0.45,
              ease: "power3.out",
            });
          }
        };

        setActive(0);

        ctx = gsap.context(() => {
          // Lateral pin: keep the left sidebar visible while the right panels scroll past.
          // pinType MUST be "transform" — pinType: "fixed" breaks inside ScrollSmoother's
          // #smooth-content because that wrapper is CSS-transformed, and `position: fixed`
          // resolves against a transformed ancestor instead of the viewport. That's why
          // the sidebar was disappearing on scroll.
          //
          // We pin the sidebar wrap (not sidebarRef itself) and end when the panels
          // container bottom hits the viewport bottom — that keeps the sidebar in view
          // for the exact vertical range covered by the panels.
          if (sidebarRef.current) {
            ScrollTrigger.create({
              trigger: sidebarRef.current,
              start: "top top",
              endTrigger: panels,
              end: "bottom bottom",
              pin: sidebarRef.current,
              pinType: "transform",
              pinSpacing: false,
              anticipatePin: 1,
            });
          }

          panelEls.forEach((panel, i) => {
            gsap.fromTo(
              panel,
              { opacity: 0, y: 48 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: panel,
                  start: "top 80%",
                  once: true,
                },
              }
            );

            ScrollTrigger.create({
              trigger: panel,
              start: "top 45%",
              end: "bottom 45%",
              onEnter: () => setActive(i),
              onEnterBack: () => setActive(i),
            });

            const bullets = panel.querySelectorAll(".exp-bullet");
            gsap.fromTo(
              bullets,
              { opacity: 0, x: -16 },
              {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: panel,
                  start: "top 70%",
                  once: true,
                },
              }
            );

            const tags = panel.querySelectorAll(".exp-tag");
            gsap.fromTo(
              tags,
              { opacity: 0, scale: 0.85 },
              {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                stagger: 0.05,
                ease: "back.out(1.5)",
                scrollTrigger: {
                  trigger: panel,
                  start: "top 65%",
                  once: true,
                },
              }
            );
          });
        }, section);
      } catch (err) {
        console.error("GSAP Experience init error:", err);
      }
    };

    init();
    return () => ctx?.revert();
  }, []);

  const scrollToPanel = (index: number) => {
    const panels = panelsRef.current?.querySelectorAll<HTMLElement>(".exp-panel");
    if (!panels) return;
    panels[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section id="experience" ref={sectionRef} className="exp-section">
      <div className="exp-bg" aria-hidden="true" />

      <div className="exp-header">
        <p className="exp-eyebrow">Career Path</p>
        <h2 className="exp-title">
          Work <em>Experience</em>
        </h2>
        <p className="exp-count">
          {EXPERIENCES.length.toString().padStart(2, "0")} positions - 2024
        </p>
      </div>

      <div className="exp-layout">
        {/* Left: GSAP-pinned sidebar */}
        <div className="exp-sidebar-wrap">
          <div ref={sidebarRef} className="exp-sidebar">
            <div className="exp-track">
              <div ref={indicatorBarRef} className="exp-indicator-bar" />
            </div>
            <nav className="exp-nav" aria-label="Experience navigation">
              {EXPERIENCES.map((exp, i) => (
                <button
                  key={exp.index}
                  ref={(el) => { navItemRefs.current[i] = el; }}
                  className="exp-nav-item"
                  onClick={() => scrollToPanel(i)}
                  aria-label={`Jump to ${exp.company}`}
                >
                  <span className="exp-nav-index">{exp.index}</span>
                  <span className="exp-nav-content">
                    <span className="exp-nav-company">{exp.company}</span>
                    <span className="exp-nav-role">{exp.role}</span>
                  </span>
                  {exp.status === "active" && (
                    <span className="exp-nav-live" aria-label="Currently active">
                      <span className="exp-nav-live-dot" />
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right scrollable panels */}
        <div ref={panelsRef} className="exp-panels">
          {EXPERIENCES.map((exp, i) => (
            <article key={exp.index} className="exp-panel" data-index={i}>
              <div className="exp-panel-topbar">
                <div className="exp-panel-num">{exp.index}</div>
                <div className="exp-panel-period">
                  {exp.status === "active" && (
                    <span className="exp-panel-live">
                      <span className="exp-panel-live-dot" />
                      Active
                    </span>
                  )}
                  <time>{exp.period}</time>
                </div>
              </div>

              <div className="exp-panel-hero">
                <h3 className="exp-panel-role">{exp.role}</h3>
                <div className="exp-panel-company-row">
                  <span className="exp-panel-company">{exp.company}</span>
                  <span className="exp-panel-sep" aria-hidden="true" />
                  <span className="exp-panel-type">{exp.type}</span>
                </div>
              </div>

              <div className="exp-panel-divider" aria-hidden="true" />

              <p className="exp-panel-summary">{exp.summary}</p>

              <ul className="exp-panel-bullets" aria-label="Key achievements">
                {exp.bullets.map((bullet, bi) => (
                  <li key={bi} className="exp-bullet">
                    <span className="exp-bullet-arrow" aria-hidden="true">{">"}</span>
                    <span className="exp-bullet-text">{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="exp-panel-tags" aria-label="Technologies used">
                {exp.tags.map((tag) => (
                  <span key={tag} className="exp-tag">{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
