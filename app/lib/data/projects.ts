import { Project } from './types';

// All projects data for Paras Negi's portfolio
export const projects: Project[] = [
  {
    id: 'productivity-analytics',
    name: 'Team Productivity Analytics Platform',
    description:
      'An enterprise data pipeline and analytics dashboard built at Rubrik for a 100+ person IT organization across 15+ Jira boards. Integrated Jira, Workday, and Google Drive, utilizing a chunked fetch strategy to reduce JVM heap footprint from ~85 MB to ~26 MB.',
    tags: ['MuleSoft 4', 'Jira API', 'Workday API', 'DataWeave', 'CloudHub 2.0'],
    githubUrl: 'https://github.com/parasnegi783/productivity-analytics',
    featured: true,
  },
  {
    id: 'personal-portfolio',
    name: 'Personal Portfolio Website',
    description:
      'An interactive portfolio website built with Next.js 14, featuring a custom SVG schematic node map, structural page layouts, smooth GSAP animations, and a sophisticated dark design system.',
    tags: ['Next.js 14', 'TypeScript', 'GSAP', 'Framer Motion', 'Tailwind CSS'],
    githubUrl: 'https://github.com/parasnegi783/portfolio',
    liveUrl: 'https://parasnegi.vercel.app',
    featured: true,
  },
  {
    id: 'facilities-router',
    name: 'AI Facilities Request Router',
    description:
      'An automated request routing agent built during Rubrik internship using Glean\'s Model Context Protocol (MCP) server over Streamable HTTP. Automatically categorizes incoming Slack requests and assigns Jira issues with bidirectional comment syncing.',
    tags: ['Glean AI', 'Claude AI', 'MCP', 'Slack API', 'Jira API'],
    githubUrl: 'https://github.com/parasnegi783/facilities-router',
  },
  {
    id: 'sox-compliance',
    name: 'SOX Compliance Audit Automation',
    description:
      'An automation suite traversing Anypoint organization trees via Management APIs (OAuth 2.0) to extract audit events, check active users, and upload security evidence packages to Box. Saved 15+ hours of manual quarterly effort.',
    tags: ['MuleSoft 4', 'Anypoint API', 'Box API', 'OAuth 2.0', 'Automation'],
    githubUrl: 'https://github.com/parasnegi783/sox-compliance',
  },
  {
    id: 'bel-homepage',
    name: 'BEL Homepage & Content CMS',
    description:
      'Led the full-stack development of Bharat Electronics Limited\'s (BEL) official homepage using Django and Tailwind CSS. Implemented multilingual features, responsive dynamic navigation, and role-based admin panels.',
    tags: ['Django', 'Python', 'Tailwind CSS', 'PostgreSQL', 'Agile'],
    githubUrl: 'https://github.com/parasnegi783/bel-homepage',
  },
  {
    id: 'evon-mern-suite',
    name: 'MERN RESTful API & Component Suite',
    description:
      'Developed responsive frontend components and integrated secure RESTful APIs using React.js, Express.js, and MongoDB during trainee developer role, leveraging collaborative Git workflows.',
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
    githubUrl: 'https://github.com/parasnegi783/blog-app',
  },
];
