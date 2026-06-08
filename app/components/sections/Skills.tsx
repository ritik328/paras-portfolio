'use client';

import { useState, useRef } from 'react';

interface SkillNode {
  id: string;
  label: string;
  subLabel?: string;
  x: number;
  y: number;
  shape: 'hexagon' | 'square' | 'triangle' | 'circle' | 'star';
  group: string;
  catColor: string;
  labelPos: 'top' | 'bottom' | 'left' | 'right';
  num?: number;
}

const SKILL_NODES: SkillNode[] = [
  // Center node
  {
    id: 'center',
    label: 'Paras Negi',
    subLabel: 'B.TECH CSE',
    x: 500,
    y: 300,
    shape: 'star',
    group: 'center',
    catColor: '#e07040',
    labelPos: 'bottom',
  },
  // Category hexagon hubs
  {
    id: 'languages',
    label: 'Languages',
    num: 1,
    x: 320,
    y: 190,
    shape: 'hexagon',
    group: 'languages',
    catColor: '#e07040',
    labelPos: 'bottom',
  },
  {
    id: 'frameworks',
    label: 'Frameworks',
    num: 2,
    x: 680,
    y: 190,
    shape: 'hexagon',
    group: 'frameworks',
    catColor: '#5a9fd4',
    labelPos: 'bottom',
  },
  {
    id: 'tools',
    label: 'Tools & DBs',
    num: 3,
    x: 320,
    y: 410,
    shape: 'hexagon',
    group: 'tools',
    catColor: '#70b894',
    labelPos: 'bottom',
  },
  {
    id: 'ai',
    label: 'AI Tools',
    num: 4,
    x: 680,
    y: 410,
    shape: 'hexagon',
    group: 'ai',
    catColor: '#b47ed4',
    labelPos: 'bottom',
  },

  // Languages leaf nodes (squares)
  { id: 'lang-sql', label: 'SQL', x: 400, y: 80, shape: 'square', group: 'languages', catColor: '#e07040', labelPos: 'top' },
  { id: 'lang-java', label: 'Java', x: 340, y: 60, shape: 'square', group: 'languages', catColor: '#e07040', labelPos: 'top' },
  { id: 'lang-html', label: 'HTML', x: 280, y: 60, shape: 'square', group: 'languages', catColor: '#e07040', labelPos: 'top' },
  { id: 'lang-python', label: 'Python', x: 220, y: 80, shape: 'square', group: 'languages', catColor: '#e07040', labelPos: 'top' },
  { id: 'lang-cpp', label: 'C++', x: 160, y: 110, shape: 'square', group: 'languages', catColor: '#e07040', labelPos: 'top' },
  { id: 'lang-js', label: 'JavaScript', x: 120, y: 160, shape: 'square', group: 'languages', catColor: '#e07040', labelPos: 'left' },
  { id: 'lang-css', label: 'CSS', x: 110, y: 220, shape: 'square', group: 'languages', catColor: '#e07040', labelPos: 'left' },
  { id: 'lang-c', label: 'C', x: 130, y: 280, shape: 'square', group: 'languages', catColor: '#e07040', labelPos: 'left' },

  // Frameworks leaf nodes (squares)
  { id: 'fw-wordpress', label: 'WordPress', x: 600, y: 80, shape: 'square', group: 'frameworks', catColor: '#5a9fd4', labelPos: 'top' },
  { id: 'fw-nodejs', label: 'Node.js', x: 660, y: 60, shape: 'square', group: 'frameworks', catColor: '#5a9fd4', labelPos: 'top' },
  { id: 'fw-django', label: 'Django', x: 720, y: 60, shape: 'square', group: 'frameworks', catColor: '#5a9fd4', labelPos: 'top' },
  { id: 'fw-react', label: 'React.js', x: 780, y: 80, shape: 'square', group: 'frameworks', catColor: '#5a9fd4', labelPos: 'top' },
  { id: 'fw-express', label: 'Express.js', x: 840, y: 110, shape: 'square', group: 'frameworks', catColor: '#5a9fd4', labelPos: 'top' },
  { id: 'fw-tailwind', label: 'Tailwind', x: 880, y: 160, shape: 'square', group: 'frameworks', catColor: '#5a9fd4', labelPos: 'right' },
  { id: 'fw-bootstrap', label: 'Bootstrap', x: 890, y: 220, shape: 'square', group: 'frameworks', catColor: '#5a9fd4', labelPos: 'right' },

  // Tools & DBs leaf nodes (triangles)
  { id: 'tool-mongodb', label: 'MongoDB', x: 130, y: 320, shape: 'triangle', group: 'tools', catColor: '#70b894', labelPos: 'left' },
  { id: 'tool-mysql', label: 'MySQL', x: 110, y: 380, shape: 'triangle', group: 'tools', catColor: '#70b894', labelPos: 'left' },
  { id: 'tool-git', label: 'Git', x: 120, y: 440, shape: 'triangle', group: 'tools', catColor: '#70b894', labelPos: 'left' },
  { id: 'tool-github', label: 'GitHub', x: 160, y: 490, shape: 'triangle', group: 'tools', catColor: '#70b894', labelPos: 'left' },
  { id: 'tool-postman', label: 'Postman', x: 220, y: 520, shape: 'triangle', group: 'tools', catColor: '#70b894', labelPos: 'bottom' },
  { id: 'tool-vscode', label: 'VS Code', x: 280, y: 540, shape: 'triangle', group: 'tools', catColor: '#70b894', labelPos: 'bottom' },
  { id: 'tool-hadoop', label: 'Hadoop', x: 340, y: 540, shape: 'triangle', group: 'tools', catColor: '#70b894', labelPos: 'bottom' },
  { id: 'tool-oracle', label: 'Oracle', x: 400, y: 520, shape: 'triangle', group: 'tools', catColor: '#70b894', labelPos: 'bottom' },

  // AI Tools leaf nodes (circles)
  { id: 'ai-copilot', label: 'GitHub Copilot', x: 600, y: 520, shape: 'circle', group: 'ai', catColor: '#b47ed4', labelPos: 'bottom' },
  { id: 'ai-chatgpt', label: 'ChatGPT', x: 660, y: 540, shape: 'circle', group: 'ai', catColor: '#b47ed4', labelPos: 'bottom' },
  { id: 'ai-gemini', label: 'Gemini', x: 720, y: 540, shape: 'circle', group: 'ai', catColor: '#b47ed4', labelPos: 'bottom' },
  { id: 'ai-claude', label: 'Claude AI', x: 780, y: 520, shape: 'circle', group: 'ai', catColor: '#b47ed4', labelPos: 'bottom' },
  { id: 'ai-dalle', label: 'DALL·E', x: 840, y: 490, shape: 'circle', group: 'ai', catColor: '#b47ed4', labelPos: 'right' },
  { id: 'ai-notion', label: 'Notion AI', x: 880, y: 440, shape: 'circle', group: 'ai', catColor: '#b47ed4', labelPos: 'right' },
];

const categoryHubs = {
  languages: { x: 320, y: 190 },
  frameworks: { x: 680, y: 190 },
  tools: { x: 320, y: 410 },
  ai: { x: 680, y: 410 },
};

const getOrthogonalPath = (cx: number, cy: number, x: number, y: number) => {
  const dx = x - cx;
  const dy = y - cy;
  if (dx === 0 || dy === 0) {
    return `M ${cx} ${cy} L ${x} ${y}`;
  }
  const diagDx = Math.sign(dx) * Math.abs(dy);
  const x1 = x - diagDx;
  if (Math.sign(x1 - cx) === Math.sign(dx)) {
    return `M ${cx} ${cy} L ${x1} ${cy} L ${x} ${y}`;
  } else {
    const diagDy = Math.sign(dy) * Math.abs(dx);
    const y1 = y - diagDy;
    return `M ${cx} ${cy} L ${cx} ${y1} L ${x} ${y}`;
  }
};

interface Connection {
  from: string;
  to: string;
  path: string;
}

const CONNECTIONS: Connection[] = [
  // Center to Categories
  { from: 'center', to: 'languages', path: 'M 500 300 L 410 300 L 320 190' },
  { from: 'center', to: 'frameworks', path: 'M 500 300 L 590 300 L 680 190' },
  { from: 'center', to: 'tools', path: 'M 500 300 L 410 300 L 320 410' },
  { from: 'center', to: 'ai', path: 'M 500 300 L 590 300 L 680 410' },
];

// Compile connections dynamically
SKILL_NODES.forEach((node) => {
  if (node.id !== 'center' && node.shape !== 'hexagon') {
    const parentHub = categoryHubs[node.group as keyof typeof categoryHubs];
    if (parentHub) {
      CONNECTIONS.push({
        from: node.group,
        to: node.id,
        path: getOrthogonalPath(parentHub.x, parentHub.y, node.x, node.y),
      });
    }
  }
});

/**
 * Skills section showing a static SVG blueprint map that mirrors the InteractiveMap style.
 */
export function Skills() {
  const lastClickRef = useRef<number>(0);
  const clickCountRef = useRef<number>(0);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);

  const handleHeadingClick = () => {
    const now = Date.now();
    if (now - lastClickRef.current < 800) {
      clickCountRef.current += 1;
    } else {
      clickCountRef.current = 1;
    }
    lastClickRef.current = now;

    if (clickCountRef.current >= 3) {
      window.dispatchEvent(new CustomEvent('toggle-hero-editor'));
      clickCountRef.current = 0;
    }
  };

  const handleNodeHover = (node: SkillNode | null) => {
    if (node) {
      setHoveredNodeId(node.id);
      if (node.id !== 'center') {
        setHoveredGroupId(node.group);
      }
    } else {
      setHoveredNodeId(null);
      setHoveredGroupId(null);
    }
  };

  const isConnectionActive = (conn: Connection) => {
    if (hoveredNodeId === conn.to || hoveredNodeId === conn.from) return true;
    if (hoveredGroupId) {
      const toNode = SKILL_NODES.find((n) => n.id === conn.to);
      const fromNode = SKILL_NODES.find((n) => n.id === conn.from);
      if (toNode?.group === hoveredGroupId || fromNode?.group === hoveredGroupId) {
        return true;
      }
    }
    return false;
  };

  const getActiveColor = (conn: Connection) => {
    const targetNode = SKILL_NODES.find((n) => n.id === conn.to);
    return targetNode?.catColor ?? '#e07040';
  };

  const renderNodeShape = (node: SkillNode) => {
    const { x, y, shape, id } = node;
    const isActive = hoveredNodeId === id || (hoveredGroupId === node.group && id !== 'center');
    const strokeColor = isActive ? node.catColor : '#3a3a38';
    const dotColor = isActive ? node.catColor : '#888884';

    switch (shape) {
      case 'star': // Center cog shape
        return (
          <g
            transform={`translate(${x}, ${y})`}
            className="cursor-pointer group/cog"
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
            stroke={strokeColor}
            strokeWidth={1.5}
            className="transition-all duration-300 cursor-pointer"
          />
        );
      }

      case 'square':
        return (
          <g className="cursor-pointer">
            <rect
              x={x - 7}
              y={y - 7}
              width={14}
              height={14}
              fill="#161614"
              stroke={strokeColor}
              strokeWidth={1.5}
              className="transition-all duration-300"
            />
            <circle
              cx={x}
              cy={y}
              r={1.8}
              fill={dotColor}
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
          <g className="cursor-pointer">
            <polygon
              points={triPoints}
              fill="#161614"
              stroke={strokeColor}
              strokeWidth={1.5}
              className="transition-all duration-300"
            />
            <circle
              cx={x}
              cy={y + 1}
              r={1.5}
              fill={dotColor}
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
            fill={isActive ? node.catColor : '#161614'}
            stroke={strokeColor}
            strokeWidth={1.5}
            className="transition-all duration-300 cursor-pointer"
          />
        );

      default:
        return null;
    }
  };

  return (
    <section id="skills" className="skills-section" aria-labelledby="skills-heading">
      {/* Background dot grid */}
      <div className="skills-bg-grid" aria-hidden="true" />

      {/* Header */}
      <div className="skills-header">
        <p className="skills-eyebrow">Technical Proficiency</p>
        <h2
          id="skills-heading"
          className="skills-title cursor-pointer select-none hover:text-[#e07040] transition-colors"
          onClick={handleHeadingClick}
          title="Triple click to toggle Hero layout editor"
        >
          Skills &amp; Technologies
        </h2>
        <p className="skills-desc">
          Hover over the nodes to explore my skills. Each cluster represents a
          category — interact with the blueprint schema.
        </p>
      </div>

      {/* SVG Interactive Map */}
      <div className="skills-canvas-wrap">
        <svg
          viewBox="0 0 1000 600"
          width="100%"
          height="100%"
          className="w-full h-full select-none"
          aria-label="Interactive skills node map blueprint"
          role="img"
        >
          {/* Background Grid Lines (blueprint styling) */}
          <defs>
            <pattern id="skills-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#222220" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#skills-grid)" opacity="0.3" />

          {/* Connection lines */}
          <g>
            {CONNECTIONS.map((conn, idx) => {
              const active = isConnectionActive(conn);
              const color = active ? getActiveColor(conn) : '#3a3a38';
              return (
                <path
                  key={`line-${idx}`}
                  d={conn.path}
                  fill="none"
                  stroke={color}
                  strokeWidth={active ? 2 : 1}
                  className="transition-all duration-300 ease-out"
                  opacity={active ? 1 : 0.6}
                />
              );
            })}
          </g>

          {/* Active path glowing shadows */}
          <g>
            {CONNECTIONS.map((conn, idx) => {
              const active = isConnectionActive(conn);
              if (!active) return null;
              const color = getActiveColor(conn);
              return (
                <path
                  key={`glow-${idx}`}
                  d={conn.path}
                  fill="none"
                  stroke={color}
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
            {SKILL_NODES.map((node) => {
              const isActive =
                hoveredNodeId === node.id ||
                (hoveredGroupId === node.group && node.id !== 'center');

              // Label offsets
              let lx = node.x;
              let ly = node.y;
              let anchor: 'start' | 'middle' | 'end' = 'middle';

              switch (node.labelPos) {
                case 'top':
                  ly = node.y - 20;
                  break;
                case 'bottom':
                  ly = node.y + (node.id === 'center' ? 28 : 20);
                  break;
                case 'left':
                  lx = node.x - 18;
                  anchor = 'end';
                  break;
                case 'right':
                  lx = node.x + 18;
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
                  {/* Invisible pointer hit area */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={20}
                    fill="transparent"
                    className="cursor-pointer"
                  />

                  {/* Node Shape */}
                  {renderNodeShape(node)}

                  {/* Category numbers inside hexagons */}
                  {node.shape === 'hexagon' && node.num !== undefined && (
                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dy="0.35em"
                      fill={isActive ? node.catColor : '#f0ede6'}
                      fontSize={12}
                      fontWeight="bold"
                      className="pointer-events-none font-mono"
                    >
                      {node.num}
                    </text>
                  )}

                  {/* Node Label Text */}
                  <g className="cursor-pointer pointer-events-none">
                    <text
                      x={lx}
                      y={ly}
                      textAnchor={anchor}
                      fontSize={node.id === 'center' ? 16 : node.shape === 'hexagon' ? 13 : 11}
                      fontWeight={
                        node.id === 'center' || node.shape === 'hexagon' || isActive
                          ? '700'
                          : '500'
                      }
                      fill={
                        isActive
                          ? '#f0ede6'
                          : node.id === 'center'
                          ? '#f0ede6'
                          : '#888884'
                      }
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
      </div>
    </section>
  );
}
