'use client';

import { useState } from 'react';
import { useSmoothScroll } from '@/app/lib/hooks/useSmoothScroll';

interface Node {
  id: string;
  label: string;
  subLabel?: string;
  x: number;
  y: number;
  shape: 'hexagon' | 'square' | 'triangle' | 'circle' | 'circle_dot' | 'star';
  num?: number;
  target: string;
  group: string;
  labelPos: 'top' | 'bottom' | 'left' | 'right';
}

interface Connection {
  from: string;
  to: string;
  path: string;
  dashed?: boolean;
}

const NODES: Node[] = [
  // Center node
  {
    id: 'center',
    label: 'Paras Negi',
    subLabel: 'B.TECH CSE',
    x: 400,
    y: 250,
    shape: 'star',
    target: '#about',
    group: 'center',
    labelPos: 'bottom',
  },
  // Information / Contact Node at the top
  {
    id: 'contact',
    label: 'Contact Me',
    x: 400,
    y: 80,
    shape: 'circle_dot',
    target: '#contact',
    group: 'center',
    labelPos: 'top',
  },
  // Hexagon Category Branches
  {
    id: 'languages',
    label: 'Languages',
    x: 250,
    y: 160,
    shape: 'hexagon',
    num: 1,
    target: '#skills',
    group: 'languages',
    labelPos: 'bottom',
  },
  {
    id: 'frameworks',
    label: 'Frameworks',
    x: 550,
    y: 160,
    shape: 'hexagon',
    num: 2,
    target: '#skills',
    group: 'frameworks',
    labelPos: 'bottom',
  },
  {
    id: 'databases',
    label: 'Databases & Tools',
    x: 250,
    y: 340,
    shape: 'hexagon',
    num: 3,
    target: '#skills',
    group: 'databases',
    labelPos: 'bottom',
  },
  {
    id: 'experience',
    label: 'Experience',
    x: 550,
    y: 340,
    shape: 'hexagon',
    num: 4,
    target: '#experience',
    group: 'experience',
    labelPos: 'bottom',
  },
  // Leaf Nodes - Languages
  {
    id: 'python',
    label: 'Python',
    x: 150,
    y: 100,
    shape: 'square',
    target: '#skills',
    group: 'languages',
    labelPos: 'top',
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    x: 110,
    y: 170,
    shape: 'square',
    target: '#skills',
    group: 'languages',
    labelPos: 'left',
  },
  {
    id: 'cpp',
    label: 'Java / C++',
    x: 250,
    y: 60,
    shape: 'square',
    target: '#skills',
    group: 'languages',
    labelPos: 'top',
  },
  // Leaf Nodes - Frameworks
  {
    id: 'react',
    label: 'React.js',
    x: 650,
    y: 100,
    shape: 'square',
    target: '#skills',
    group: 'frameworks',
    labelPos: 'top',
  },
  {
    id: 'django',
    label: 'Django',
    x: 690,
    y: 170,
    shape: 'square',
    target: '#skills',
    group: 'frameworks',
    labelPos: 'right',
  },
  {
    id: 'node',
    label: 'Node.js',
    x: 550,
    y: 60,
    shape: 'square',
    target: '#skills',
    group: 'frameworks',
    labelPos: 'top',
  },
  // Leaf Nodes - Databases
  {
    id: 'mongodb',
    label: 'MongoDB',
    x: 150,
    y: 400,
    shape: 'triangle',
    target: '#skills',
    group: 'databases',
    labelPos: 'bottom',
  },
  {
    id: 'mysql',
    label: 'MySQL',
    x: 110,
    y: 330,
    shape: 'triangle',
    target: '#skills',
    group: 'databases',
    labelPos: 'left',
  },
  {
    id: 'git',
    label: 'Git & Docker',
    x: 250,
    y: 440,
    shape: 'triangle',
    target: '#skills',
    group: 'databases',
    labelPos: 'bottom',
  },
  // Leaf Nodes - Experience
  {
    id: 'bel',
    label: 'BEL Intern',
    x: 650,
    y: 400,
    shape: 'circle',
    target: '#experience',
    group: 'experience',
    labelPos: 'bottom',
  },
  {
    id: 'evon',
    label: 'Evon Trainee',
    x: 690,
    y: 330,
    shape: 'circle',
    target: '#experience',
    group: 'experience',
    labelPos: 'right',
  },
  {
    id: 'ai',
    label: 'AI Tools',
    x: 550,
    y: 440,
    shape: 'circle',
    target: '#skills',
    group: 'experience',
    labelPos: 'bottom',
  },
];

const CONNECTIONS: Connection[] = [
  // Center to Categories
  { from: 'center', to: 'languages', path: 'M 400 250 L 340 250 L 250 160' },
  { from: 'center', to: 'frameworks', path: 'M 400 250 L 460 250 L 550 160' },
  { from: 'center', to: 'databases', path: 'M 400 250 L 340 250 L 250 340' },
  { from: 'center', to: 'experience', path: 'M 400 250 L 460 250 L 550 340' },
  { from: 'center', to: 'contact', path: 'M 400 250 L 400 80' },

  // Languages Branch to Leaves
  { from: 'languages', to: 'python', path: 'M 250 160 L 210 160 L 150 100' },
  { from: 'languages', to: 'javascript', path: 'M 250 160 L 180 160 L 170 170 L 110 170' },
  { from: 'languages', to: 'cpp', path: 'M 250 160 L 250 60' },

  // Frameworks Branch to Leaves
  { from: 'frameworks', to: 'react', path: 'M 550 160 L 590 160 L 650 100' },
  { from: 'frameworks', to: 'django', path: 'M 550 160 L 620 160 L 630 170 L 690 170' },
  { from: 'frameworks', to: 'node', path: 'M 550 160 L 550 60' },

  // Databases Branch to Leaves
  { from: 'databases', to: 'mongodb', path: 'M 250 340 L 210 340 L 150 400' },
  { from: 'databases', to: 'mysql', path: 'M 250 340 L 180 340 L 170 330 L 110 330' },
  { from: 'databases', to: 'git', path: 'M 250 340 L 250 440' },

  // Experience Branch to Leaves (Dashed for visual style)
  { from: 'experience', to: 'bel', path: 'M 550 340 L 590 340 L 650 400', dashed: true },
  { from: 'experience', to: 'evon', path: 'M 550 340 L 620 340 L 630 330 L 690 330', dashed: true },
  { from: 'experience', to: 'ai', path: 'M 550 340 L 550 440', dashed: true },
];

export function InteractiveMap() {
  const { scrollTo } = useSmoothScroll();
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const handleNodeHover = (node: Node | null) => {
    if (node) {
      setHoveredNodeId(node.id);
      if (node.id !== 'center' && node.id !== 'contact') {
        setHoveredGroupId(node.group);
      }
    } else {
      setHoveredNodeId(null);
      setHoveredGroupId(null);
    }
  };

  const handleNodeClick = (target: string) => {
    scrollTo(target);
  };

  // Helper to determine if a connection path is active
  const isConnectionActive = (conn: Connection) => {
    if (hoveredNodeId === conn.to || hoveredNodeId === conn.from) return true;
    if (hoveredGroupId) {
      const toNode = NODES.find(n => n.id === conn.to);
      const fromNode = NODES.find(n => n.id === conn.from);
      if (toNode?.group === hoveredGroupId || fromNode?.group === hoveredGroupId) {
        return true;
      }
    }
    return false;
  };

  // Helper to render node shapes based on category
  const renderNodeShape = (node: Node) => {
    const { x, y, shape, num, id } = node;
    const isActive = hoveredNodeId === id || (hoveredGroupId === node.group && id !== 'center' && id !== 'contact');

    switch (shape) {
      case 'star': // Center cog shape
        return (
          <g
            transform={`translate(${x}, ${y})`}
            className="cursor-pointer group/cog"
            onClick={() => handleNodeClick(node.target)}
          >
            {/* Outer soft glowing ring */}
            <circle
              cx={0}
              cy={0}
              r={20}
              fill="rgba(224, 112, 64, 0.15)"
              className={`transition-opacity duration-300 pointer-events-none ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {/* Cog teeth */}
            {[...Array(8)].map((_, i) => {
              const angle = (i * Math.PI) / 4;
              const x1 = Math.cos(angle) * 10;
              const y1 = Math.sin(angle) * 10;
              const x2 = Math.cos(angle) * 14;
              const y2 = Math.sin(angle) * 14;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#e07040"
                  strokeWidth={3}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              );
            })}
            <circle cx={0} cy={0} r={10} fill="#e07040" />
            <circle cx={0} cy={0} r={4} fill="#0d0d0c" />
          </g>
        );

      case 'hexagon': {
        const hexPoints = [
          [x - 15, y],
          [x - 8, y - 13],
          [x + 8, y - 13],
          [x + 15, y],
          [x + 8, y + 13],
          [x - 8, y + 13],
        ]
          .map((p) => p.join(','))
          .join(' ');

        return (
          <polygon
            points={hexPoints}
            fill="#161614"
            stroke={isActive ? '#e07040' : '#3a3a38'}
            strokeWidth={1.5}
            className="transition-all duration-300 cursor-pointer"
            onClick={() => handleNodeClick(node.target)}
          />
        );
      }

      case 'square':
        return (
          <g className="cursor-pointer" onClick={() => handleNodeClick(node.target)}>
            <rect
              x={x - 7}
              y={y - 7}
              width={14}
              height={14}
              fill="#161614"
              stroke={isActive ? '#e07040' : '#3a3a38'}
              strokeWidth={1.5}
              className="transition-all duration-300"
            />
            <circle
              cx={x}
              cy={y}
              r={1.8}
              fill={isActive ? '#e07040' : '#888884'}
              className="transition-colors duration-300"
            />
          </g>
        );

      case 'triangle': {
        const triPoints = [
          [x, y - 9],
          [x - 9, y + 7],
          [x + 9, y + 7],
        ]
          .map((p) => p.join(','))
          .join(' ');

        return (
          <g className="cursor-pointer" onClick={() => handleNodeClick(node.target)}>
            <polygon
              points={triPoints}
              fill="#161614"
              stroke={isActive ? '#e07040' : '#3a3a38'}
              strokeWidth={1.5}
              className="transition-all duration-300"
            />
            <circle
              cx={x}
              cy={y + 1}
              r={1.5}
              fill={isActive ? '#e07040' : '#888884'}
              className="transition-colors duration-300"
            />
          </g>
        );
      }

      case 'circle':
        return (
          <circle
            cx={x}
            cy={y}
            r={7}
            fill={isActive ? '#e07040' : '#161614'}
            stroke={isActive ? '#e07040' : '#3a3a38'}
            strokeWidth={1.5}
            className="transition-all duration-300 cursor-pointer"
            onClick={() => handleNodeClick(node.target)}
          />
        );

      case 'circle_dot':
        return (
          <g className="cursor-pointer" onClick={() => handleNodeClick(node.target)}>
            <circle
              cx={x}
              cy={y}
              r={7}
              fill="#0d0d0c"
              stroke={isActive ? '#e07040' : '#3a3a38'}
              strokeWidth={1.5}
              className="transition-all duration-300"
            />
            <circle
              cx={x}
              cy={y}
              r={2}
              fill={isActive ? '#e07040' : '#f0ede6'}
              className="transition-colors duration-300"
            />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <svg
      viewBox="0 0 800 500"
      width="100%"
      height="100%"
      className="w-full h-full select-none"
      aria-label="Interactive schematic skills node map"
      role="img"
    >
      {/* Background Grid Lines (minimally styled like blueprint paper) */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#222220" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />

      {/* Schematic connection lines */}
      <g>
        {CONNECTIONS.map((conn, idx) => {
          const active = isConnectionActive(conn);
          return (
            <path
              key={idx}
              d={conn.path}
              fill="none"
              stroke={active ? '#e07040' : '#3a3a38'}
              strokeWidth={active ? 2 : 1}
              strokeDasharray={conn.dashed ? '4,4' : undefined}
              className="transition-all duration-300 ease-out"
              opacity={active ? 1 : 0.6}
            />
          );
        })}
      </g>

      {/* Connection path shadows / glows on hover */}
      <g>
        {CONNECTIONS.map((conn, idx) => {
          const active = isConnectionActive(conn);
          if (!active) return null;
          return (
            <path
              key={`glow-${idx}`}
              d={conn.path}
              fill="none"
              stroke="#e07040"
              strokeWidth={6}
              strokeLinecap="round"
              opacity={0.15}
              className="pointer-events-none"
            />
          );
        })}
      </g>

      {/* Nodes and Labels */}
      <g>
        {NODES.map((node) => {
          const isActive =
            hoveredNodeId === node.id ||
            (hoveredGroupId === node.group && node.id !== 'center' && node.id !== 'contact');

          // Label layout offset calculations
          let lx = node.x;
          let ly = node.y;
          let anchor: 'start' | 'middle' | 'end' = 'middle';

          switch (node.labelPos) {
            case 'top':
              ly = node.y - 24;
              break;
            case 'bottom':
              ly = node.y + (node.id === 'center' ? 28 : 24);
              break;
            case 'left':
              lx = node.x - 22;
              anchor = 'end';
              break;
            case 'right':
              lx = node.x + 22;
              anchor = 'start';
              break;
          }

          return (
            <g
              key={node.id}
              onMouseEnter={() => handleNodeHover(node)}
              onMouseLeave={() => handleNodeHover(null)}
              className="group"
            >
              {/* Interaction hitbox */}
              <circle
                cx={node.x}
                cy={node.y}
                r={24}
                fill="transparent"
                className="cursor-pointer"
                onClick={() => handleNodeClick(node.target)}
              />

              {/* Draw Shape */}
              {renderNodeShape(node)}

              {/* Category Numbers inside Hexagons */}
              {node.shape === 'hexagon' && node.num !== undefined && (
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dy="0.35em"
                  fill={isActive ? '#e07040' : '#f0ede6'}
                  fontSize={12}
                  fontWeight="bold"
                  className="pointer-events-none font-mono cursor-pointer"
                  onClick={() => handleNodeClick(node.target)}
                >
                  {node.num}
                </text>
              )}

              {/* Text label details */}
              <g
                className="cursor-pointer pointer-events-none"
                onClick={() => handleNodeClick(node.target)}
              >
                {/* Main Label */}
                <text
                  x={lx}
                  y={ly}
                  textAnchor={anchor}
                  fontSize={node.id === 'center' ? 16 : node.shape === 'hexagon' ? 13 : 12}
                  fontWeight={node.id === 'center' || node.shape === 'hexagon' || isActive ? '700' : '500'}
                  fill={isActive ? '#f0ede6' : node.id === 'center' ? '#f0ede6' : '#888884'}
                  fontFamily="var(--font-sans), sans-serif"
                  className="transition-colors duration-300"
                >
                  {node.label}
                </text>

                {/* Optional Sub-Label */}
                {node.subLabel && (
                  <text
                    x={lx}
                    y={ly + 16}
                    textAnchor={anchor}
                    fontSize={10}
                    fill="#888884"
                    fontFamily="var(--font-mono), monospace"
                    className="font-semibold tracking-wider"
                  >
                    {node.subLabel}
                  </text>
                )}
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
