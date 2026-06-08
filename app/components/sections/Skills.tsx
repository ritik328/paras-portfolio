'use client';

import { useState, useRef, useEffect } from 'react';
import { Sliders, RotateCcw, X } from 'lucide-react';

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
interface SkillsLayoutSettings {
  mapScale: number;
  mapX: number;
  mapY: number;
  canvasHeight: number;
  headerScale: number;
  headerX: number;
  headerY: number;
}

const DEFAULT_SETTINGS: SkillsLayoutSettings = {
  mapScale: 1.0,
  mapX: 0,
  mapY: 0,
  canvasHeight: 560,
  headerScale: 1.0,
  headerX: 0,
  headerY: 0,
};

export function Skills() {
  const [settings, setSettings] = useState<SkillsLayoutSettings>(DEFAULT_SETTINGS);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const lastClickRef = useRef<number>(0);
  const clickCountRef = useRef<number>(0);
  const lastCenterClickRef = useRef<number>(0);
  const centerClickCountRef = useRef<number>(0);

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);

  // Load settings from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('skills-layout-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse skills layout settings', e);
      }
    }
  }, []);

  const updateSetting = (key: keyof SkillsLayoutSettings, value: number) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem('skills-layout-settings', JSON.stringify(updated));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('skills-layout-settings', JSON.stringify(DEFAULT_SETTINGS));
  };

  const handleCenterNodeClick = () => {
    const now = Date.now();
    console.log("Skills map center node clicked, time since last:", now - lastCenterClickRef.current);
    if (now - lastCenterClickRef.current < 800) {
      centerClickCountRef.current += 1;
    } else {
      centerClickCountRef.current = 1;
    }
    lastCenterClickRef.current = now;
    console.log("Skills map center click count:", centerClickCountRef.current);

    if (centerClickCountRef.current >= 3) {
      console.log("Toggling Skills Editor panel. Open state was:", isEditorOpen);
      setIsEditorOpen((prev) => !prev);
      centerClickCountRef.current = 0;
    }
  };

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
    const strokeColor = isActive ? node.catColor : 'var(--color-border)';
    const dotColor = isActive ? node.catColor : 'var(--color-text-secondary)';

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
             <circle cx={0} cy={0} r={4} fill="var(--background)" />
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
            fill="var(--color-surface-secondary)"
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
              fill="var(--color-surface-secondary)"
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
              fill="var(--color-surface-secondary)"
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
            fill={isActive ? node.catColor : 'var(--color-surface-secondary)'}
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
      <div
        className="skills-header"
        style={{
          transform: mounted
            ? `translate(${settings.headerX}px, ${settings.headerY}px) scale(${settings.headerScale})`
            : undefined,
          transformOrigin: 'left center',
          transition: 'transform 0.3s ease',
        }}
      >
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
      <div
        className="skills-canvas-wrap"
        style={{
          height: mounted ? `${settings.canvasHeight}px` : undefined,
          transition: 'height 0.3s ease',
        }}
      >
        <div
          className="w-full h-full"
          style={{
            transform: mounted
              ? `translate(${settings.mapX}px, ${settings.mapY}px) scale(${settings.mapScale})`
              : undefined,
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease',
          }}
        >
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
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-grid)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#skills-grid)" opacity="0.3" />

            {/* Connection lines */}
            <g>
              {CONNECTIONS.map((conn, idx) => {
                const active = isConnectionActive(conn);
                const color = active ? getActiveColor(conn) : 'var(--color-border)';
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
                    ly = node.y - 24;
                    break;
                  case 'bottom':
                    ly = node.y + (node.id === 'center' ? 32 : node.shape === 'hexagon' ? 30 : 22);
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
                    {/* Node Shape */}
                    {renderNodeShape(node)}

                    {/* Category numbers inside hexagons */}
                    {node.shape === 'hexagon' && node.num !== undefined && (
                      <text
                        x={node.x}
                        y={node.y}
                        textAnchor="middle"
                        dy="0.35em"
                        fill={isActive ? node.catColor : 'var(--color-text-primary)'}
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
                            ? 'var(--color-text-primary)'
                            : node.id === 'center'
                            ? 'var(--color-text-primary)'
                            : 'var(--color-text-secondary)'
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
                          fill="var(--color-text-secondary)"
                          fontFamily="var(--font-mono), monospace"
                          className="font-semibold tracking-wider"
                        >
                          {node.subLabel}
                        </text>
                      )}
                    </g>

                    {/* Invisible pointer hit area (rendered last so it sits on top and captures clicks/hovers) */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.id === 'center' ? 30 : 20}
                      fill="black"
                      opacity="0"
                      className="cursor-pointer"
                      onClick={node.id === 'center' ? handleCenterNodeClick : undefined}
                    />
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Floating Layout Settings Editor Panel */}
      {isEditorOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-[#161614]/95 backdrop-blur-md border border-[#3a3a38] rounded-2xl p-5 shadow-2xl animate-fade-in text-left">
          <div className="flex justify-between items-center mb-4 border-b border-[#3a3a38] pb-3">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-[#e07040]" />
              <h3 className="font-sans font-bold text-sm text-[#f0ede6]">Skills Layout Editor</h3>
            </div>
            <button
              onClick={() => setIsEditorOpen(false)}
              className="text-[#888884] hover:text-[#f0ede6] transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 select-none font-sans text-xs">
            {/* Map Scale */}
            <div>
              <div className="flex justify-between text-[#888884] mb-1">
                <span>Map Scale</span>
                <span className="font-mono text-[#e07040]">{settings.mapScale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.5"
                step="0.05"
                value={settings.mapScale}
                onChange={(e) => updateSetting('mapScale', Number(e.target.value))}
                className="w-full h-1 bg-[#2a2a28] rounded-lg appearance-none cursor-pointer accent-[#e07040]"
              />
            </div>

            {/* Canvas Height */}
            <div>
              <div className="flex justify-between text-[#888884] mb-1">
                <span>Canvas Height</span>
                <span className="font-mono text-[#e07040]">{settings.canvasHeight}px</span>
              </div>
              <input
                type="range"
                min="350"
                max="800"
                step="10"
                value={settings.canvasHeight}
                onChange={(e) => updateSetting('canvasHeight', Number(e.target.value))}
                className="w-full h-1 bg-[#2a2a28] rounded-lg appearance-none cursor-pointer accent-[#e07040]"
              />
            </div>

            {/* Map Offsets */}
            <div>
              <div className="flex justify-between text-[#888884] mb-1">
                <span>Map Translation X</span>
                <span className="font-mono text-[#e07040]">{settings.mapX}px</span>
              </div>
              <input
                type="range"
                min="-150"
                max="150"
                step="5"
                value={settings.mapX}
                onChange={(e) => updateSetting('mapX', Number(e.target.value))}
                className="w-full h-1 bg-[#2a2a28] rounded-lg appearance-none cursor-pointer accent-[#e07040]"
              />
            </div>

            <div>
              <div className="flex justify-between text-[#888884] mb-1">
                <span>Map Translation Y</span>
                <span className="font-mono text-[#e07040]">{settings.mapY}px</span>
              </div>
              <input
                type="range"
                min="-150"
                max="150"
                step="5"
                value={settings.mapY}
                onChange={(e) => updateSetting('mapY', Number(e.target.value))}
                className="w-full h-1 bg-[#2a2a28] rounded-lg appearance-none cursor-pointer accent-[#e07040]"
              />
            </div>

            {/* Header Scale */}
            <div>
              <div className="flex justify-between text-[#888884] mb-1">
                <span>Header Scale</span>
                <span className="font-mono text-[#e07040]">{settings.headerScale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.05"
                value={settings.headerScale}
                onChange={(e) => updateSetting('headerScale', Number(e.target.value))}
                className="w-full h-1 bg-[#2a2a28] rounded-lg appearance-none cursor-pointer accent-[#e07040]"
              />
            </div>

            {/* Header Translation */}
            <div>
              <div className="flex justify-between text-[#888884] mb-1">
                <span>Header Translation X</span>
                <span className="font-mono text-[#e07040]">{settings.headerX}px</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="5"
                value={settings.headerX}
                onChange={(e) => updateSetting('headerX', Number(e.target.value))}
                className="w-full h-1 bg-[#2a2a28] rounded-lg appearance-none cursor-pointer accent-[#e07040]"
              />
            </div>

            <div>
              <div className="flex justify-between text-[#888884] mb-1">
                <span>Header Translation Y</span>
                <span className="font-mono text-[#e07040]">{settings.headerY}px</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                step="5"
                value={settings.headerY}
                onChange={(e) => updateSetting('headerY', Number(e.target.value))}
                className="w-full h-1 bg-[#2a2a28] rounded-lg appearance-none cursor-pointer accent-[#e07040]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-5 pt-3 border-t border-[#3a3a38]">
            <div className="flex gap-3">
              <button
                onClick={resetSettings}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#2a2a28] hover:bg-[#3a3a38] text-[#f0ede6] rounded-xl font-medium text-xs transition-colors duration-200"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
                  alert("Settings JSON copied to clipboard! You can paste them into DEFAULT_SETTINGS inside Skills.tsx.");
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#2a2a28] hover:bg-[#3a3a38] text-[#c8b89a] rounded-xl font-medium text-xs transition-colors duration-200"
              >
                <span>Copy Config</span>
              </button>
            </div>
            <button
              onClick={() => setIsEditorOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-[#e07040] hover:bg-[#c8b89a] hover:text-[#0d0d0c] text-[#0d0d0c] rounded-xl font-medium text-xs transition-colors duration-200"
            >
              <span>Save &amp; Close</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
