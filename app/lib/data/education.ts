import { Education, Certification } from './types';

// Education data for Paras Negi
export const education: Education[] = [
  {
    id: 'btech',
    degree: 'B.Tech in Computer Science',
    institution: 'Amritsar Group of Colleges',
    year: '2022 – 2026',
    description: 'Computer Science graduate with a strong focus on enterprise integration, platform automation, AI-integrated workflows, and cloud-native solutions.',
  },
];

// Certifications data
export const certifications: Certification[] = [
  {
    id: 'nptel-se',
    name: 'Software Engineering',
    issuer: 'NPTEL',
    status: 'completed',
    completionDate: 'Completed',
  },
  {
    id: 'nptel-cloud',
    name: 'Cloud Computing',
    issuer: 'NPTEL',
    status: 'ongoing',
  },
];
