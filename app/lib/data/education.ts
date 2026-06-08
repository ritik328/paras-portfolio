import { Education, Certification } from './types';

// Education data for Paras Negi
export const education: Education[] = [
  {
    id: 'btech',
    degree: 'B.Tech in Computer Science',
    institution: 'Amritsar Group of Colleges',
    year: '2022 – 2026',
    description: 'Pursuing Bachelor of Technology in Computer Science with focus on full-stack development, algorithms, and modern software engineering practices.',
  },
  {
    id: 'higher-secondary',
    degree: 'Higher Secondary Education (12th)',
    institution: 'Senior Secondary School',
    year: '2020 – 2022',
    score: '83%',
    description: 'Completed higher secondary education with Science stream (Physics, Chemistry, Mathematics, Computer Science).',
  },
  {
    id: 'matriculation',
    degree: 'Matriculation (10th)',
    institution: 'Secondary School',
    year: '2020',
    score: '90%',
    description: 'Completed secondary education with distinction in Mathematics and Science.',
  },
];

// Certifications data
export const certifications: Certification[] = [
  {
    id: 'nptel-se',
    name: 'NPTEL Software Engineering',
    issuer: 'NPTEL',
    status: 'completed',
    completionDate: '2024',
  },
  {
    id: 'nptel-cloud',
    name: 'NPTEL Cloud Computing',
    issuer: 'NPTEL',
    status: 'ongoing',
  },
  {
    id: 'django-cert',
    name: 'Django Framework',
    issuer: 'Udemy',
    status: 'completed',
    completionDate: '2023',
  },
  {
    id: 'mern-cert',
    name: 'MERN Stack Development',
    issuer: 'Coursera',
    status: 'completed',
    completionDate: '2024',
  },
  {
    id: 'ai-tools-cert',
    name: 'AI Tools & Prompt Engineering',
    issuer: 'LinkedIn Learning',
    status: 'completed',
    completionDate: '2024',
  },
];
