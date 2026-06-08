import { Project } from './types';

// All projects data for Paras Negi's portfolio
export const projects: Project[] = [
  {
    id: 'personal-portfolio',
    name: 'Personal Portfolio Website',
    description:
      'An interactive portfolio website built with Next.js 14, featuring a Spider Web Canvas visualization, D3.js Force Graph for skills, smooth GSAP animations, and a sophisticated Claude-inspired dark design system.',
    tags: ['Next.js 14', 'TypeScript', 'GSAP', 'D3.js', 'Tailwind CSS', 'Framer Motion'],
    githubUrl: 'https://github.com/parasnegi783/portfolio',
    liveUrl: 'https://parasnegi.vercel.app',
    featured: true,
  },
  {
    id: 'blog-app',
    name: 'Blog Application',
    description:
      'Full-stack blog platform with user authentication, markdown support, and CRUD operations. Built with MERN stack featuring RESTful APIs and responsive design.',
    tags: ['React', 'Node.js', 'MongoDB', 'Express.js', 'JWT'],
    githubUrl: 'https://github.com/parasnegi783/blog-app',
    liveUrl: 'https://blog-app-demo.vercel.app',
  },
  {
    id: 'django-ecommerce',
    name: 'Django E-Commerce Platform',
    description:
      'Feature-rich e-commerce application with product management, cart functionality, payment integration, and admin dashboard built with Django and Python.',
    tags: ['Django', 'Python', 'PostgreSQL', 'HTML/CSS', 'Bootstrap'],
    githubUrl: 'https://github.com/parasnegi783/django-ecommerce',
  },
  {
    id: 'ai-chat-app',
    name: 'AI Chat Interface',
    description:
      'Real-time chat application integrated with AI APIs for intelligent conversation. Features include message history, code highlighting, and responsive UI.',
    tags: ['React', 'Node.js', 'Socket.io', 'OpenAI API', 'Tailwind CSS'],
    githubUrl: 'https://github.com/parasnegi783/ai-chat',
  },
];
