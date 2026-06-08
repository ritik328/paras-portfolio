import { Skill } from './types';

// Skills data categorized by type
export const skills: Skill[] = [
  // Languages
  { id: 'python', label: 'Python', category: 'Languages', proficiency: 85 },
  { id: 'javascript', label: 'JavaScript', category: 'Languages', proficiency: 90 },
  { id: 'java', label: 'Java', category: 'Languages', proficiency: 75 },
  { id: 'cpp', label: 'C++', category: 'Languages', proficiency: 70 },
  { id: 'sql', label: 'SQL', category: 'Languages', proficiency: 80 },
  { id: 'html', label: 'HTML', category: 'Languages', proficiency: 95 },
  { id: 'css', label: 'CSS', category: 'Languages', proficiency: 90 },

  // Frameworks
  { id: 'react', label: 'React.js', category: 'Frameworks', proficiency: 88 },
  { id: 'django', label: 'Django', category: 'Frameworks', proficiency: 82 },
  { id: 'nodejs', label: 'Node.js', category: 'Frameworks', proficiency: 85 },
  { id: 'express', label: 'Express.js', category: 'Frameworks', proficiency: 83 },
  { id: 'tailwind', label: 'Tailwind CSS', category: 'Frameworks', proficiency: 92 },
  { id: 'bootstrap', label: 'Bootstrap', category: 'Frameworks', proficiency: 88 },
  { id: 'wordpress', label: 'WordPress', category: 'Frameworks', proficiency: 78 },

  // Tools
  { id: 'mongodb', label: 'MongoDB', category: 'Tools', proficiency: 80 },
  { id: 'mysql', label: 'MySQL', category: 'Tools', proficiency: 82 },
  { id: 'git', label: 'Git', category: 'Tools', proficiency: 88 },
  { id: 'github', label: 'GitHub', category: 'Tools', proficiency: 90 },
  { id: 'vscode', label: 'VS Code', category: 'Tools', proficiency: 95 },

  // AI Tools
  { id: 'chatgpt', label: 'ChatGPT', category: 'AI Tools', proficiency: 90 },
  { id: 'github-copilot', label: 'GitHub Copilot', category: 'AI Tools', proficiency: 85 },
  { id: 'claude', label: 'Claude AI', category: 'AI Tools', proficiency: 88 },
  { id: 'gemini', label: 'Gemini', category: 'AI Tools', proficiency: 82 },
];
