// Canvas Node for Spider Web
export interface Node {
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  label: string;
  radius: number;
  isCenter: boolean;
  targetX?: number; // Original position for spring-back
  targetY?: number;
}

// Project
export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  imageUrl?: string;
}

// Experience
export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string; // Format: "June 2024" or "2024-06"
  endDate: string; // Format: "July 2024" or "Present"
  description: string;
  responsibilities?: string[];
}

// Skill
export interface Skill {
  id: string;
  label: string;
  category: SkillCategory;
  proficiency?: number; // 0-100 optional
}

export type SkillCategory = 'Languages' | 'Frameworks' | 'Tools' | 'AI Tools';

// Education
export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  score?: string;
  description?: string;
}

// Certification
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  status: 'completed' | 'ongoing';
  completionDate?: string;
  credentialUrl?: string;
}

// Navigation Link
export interface NavLink {
  label: string;
  href: string;
}

// Statistics (for About section)
export interface Statistic {
  label: string;
  value: string;
}
