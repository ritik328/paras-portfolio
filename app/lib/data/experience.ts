import { Experience } from './types';

// Work experience data for Paras Negi
export const experiences: Experience[] = [
  {
    id: 'bel-intern',
    title: 'Summer Intern',
    company: 'Bharat Electronics Limited (BEL)',
    startDate: 'June 2024',
    endDate: 'July 2024',
    description:
      'Worked on embedded systems and IoT projects, contributing to defense electronics solutions. Gained hands-on experience with hardware-software integration and real-time system design.',
    responsibilities: [
      'Developed firmware for embedded microcontroller systems',
      'Assisted in IoT sensor data collection and processing pipelines',
      'Collaborated with senior engineers on defense-grade electronic systems',
      'Documented technical specifications and testing procedures',
    ],
  },
  {
    id: 'evon-trainee',
    title: 'Trainee Developer',
    company: 'Evon Technologies',
    startDate: 'June 2024',
    endDate: 'July 2024',
    description:
      'Developed full-stack web applications using MERN stack and gained experience in agile development practices. Built RESTful APIs and responsive React frontends for client projects.',
    responsibilities: [
      'Built RESTful APIs using Node.js and Express.js',
      'Developed responsive React components with modern hooks',
      'Implemented MongoDB database schemas and queries',
      'Participated in agile sprints and daily stand-ups',
    ],
  },
];
