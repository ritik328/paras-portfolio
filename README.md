# Paras Negi — Portfolio

A premium, interactive portfolio website built with **Next.js 16**, featuring WebGL cursor effects, D3-style interactive skill maps, Framer Motion animations, and a warm alabaster + charcoal design system with full light/dark theme support.

---

## 🚀 Tech Stack

| Category        | Technology                                    |
| --------------- | --------------------------------------------- |
| Framework       | Next.js 16 (App Router, Turbopack)            |
| Language        | TypeScript 5+ (strict mode)                   |
| Styling         | Tailwind CSS 4 + CSS Custom Properties        |
| Animations      | Framer Motion, GSAP 3                         |
| Visualizations  | HTML5 Canvas, Three.js (WebGL Tubes Cursor)   |
| Smooth Scroll   | Lenis                                         |
| Icons           | Lucide React                                  |
| Fonts           | DM Serif Display, DM Sans, JetBrains Mono     |
| Deployment      | Vercel                                        |

---

## 📂 Project Structure

```
portfolio-project/
├── public/                     # Static assets
│   └── paras.jpg               # Profile photograph
│
├── app/                        # Next.js App Router root
│   ├── layout.tsx              # Root layout — fonts, SEO metadata, WebGL cursor
│   ├── page.tsx                # Home page — assembles all sections
│   ├── globals.css             # Design system tokens, section styles, theme overrides
│   ├── sitemap.ts              # Dynamic sitemap for SEO
│   ├── robots.ts               # robots.txt configuration
│   ├── favicon.ico             # Browser tab icon
│   │
│   ├── components/
│   │   ├── sections/           # Full-page section components (ordered top → bottom)
│   │   │   ├── index.ts        # ← Barrel exports
│   │   │   ├── Navbar.tsx      # Floating dock (desktop) + Liquid Nav (mobile)
│   │   │   ├── Hero.tsx        # Full-viewport hero with cursor-following image
│   │   │   ├── About.tsx       # Bio, animated counters, skills pills
│   │   │   ├── Skills.tsx      # Interactive cog-wheel skill visualization
│   │   │   ├── Experience.tsx  # Animated vertical timeline
│   │   │   ├── Projects.tsx    # Featured + grid project cards
│   │   │   ├── Education.tsx   # Education timeline + certification badges
│   │   │   ├── Contact.tsx     # CTA with clipboard copy + social links
│   │   │   └── Footer.tsx      # Footer with scroll-to-top
│   │   │
│   │   ├── canvas/             # Canvas & WebGL visualization components
│   │   │   ├── index.ts        # ← Barrel exports
│   │   │   ├── InteractiveMap.tsx  # SVG skill map with animated cog wheels
│   │   │   └── TubesCursor.tsx     # Three.js WebGL tubes cursor effect
│   │   │
│   │   └── ui/                 # Reusable UI primitives
│   │       ├── index.ts        # ← Barrel exports
│   │       ├── Badge.tsx       # Pill-shaped status/tag badges
│   │       ├── Button.tsx      # Button component with variants
│   │       ├── Card.tsx        # Dark surface card container
│   │       └── Toast.tsx       # Toast notification component
│   │
│   └── lib/
│       ├── data/               # Typed content data (edit here to update site)
│       │   ├── index.ts        # ← Barrel exports
│       │   ├── types.ts        # TypeScript interfaces for all data models
│       │   ├── projects.ts     # Project entries
│       │   └── education.ts    # Education + certification entries
│       │
│       └── hooks/              # Custom React hooks
│           ├── index.ts        # ← Barrel exports
│           ├── useScrollPosition.ts  # Throttled scroll position tracker
│           └── useSmoothScroll.ts    # Lenis singleton smooth scroll manager
│
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
├── eslint.config.mjs           # ESLint configuration
├── postcss.config.mjs          # PostCSS (Tailwind) configuration
├── AGENTS.md                   # AI agent coding guidelines
└── README.md                   # ← You are here
```

---

## 🎨 Design System

### Color Tokens

| Token             | Dark Mode   | Light Mode  | Usage               |
| ----------------- | ----------- | ----------- | ------------------- |
| Surface Primary   | `#0d0d0c`   | `#FAF9F6`   | Page background     |
| Surface Secondary | `#1a1a18`   | `#F3F1EB`   | Cards, navbar       |
| Surface Tertiary  | `#2a2a28`   | `#E6E4DD`   | Hover states        |
| Text Primary      | `#f0ede6`   | `#1C1B1A`   | Main text           |
| Text Secondary    | `#888884`   | `#706F6A`   | Muted / helper text |
| Accent Orange     | `#e07040`   | `#D95829`   | Links, highlights   |
| Accent Cream      | `#c8b89a`   | `#B4A485`   | Decorative accents  |
| Border            | `#3a3a38`   | `#E3DFD5`   | Subtle borders      |

### Typography

| Element    | Font              | Size                         |
| ---------- | ----------------- | ---------------------------- |
| Hero H1    | DM Serif Display  | `clamp(40px, 6vw, 80px)`    |
| Section H2 | DM Serif Display  | `clamp(28px, 3.5vw, 48px)`  |
| Body       | DM Sans 400       | 16px                         |
| Code/Mono  | JetBrains Mono    | 14px                         |

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/ritik328/paras-portfolio.git
cd paras-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to view the portfolio.

### Build for Production

```bash
npm run build
npm start
```

---

## 📝 Updating Content

All content is stored in typed data files under `app/lib/data/`:

| File              | What to edit                         |
| ----------------- | ------------------------------------ |
| `projects.ts`     | Add, modify, or remove projects      |
| `education.ts`    | Update degrees and certifications    |
| `types.ts`        | Extend data models / interfaces      |

Each file exports typed TypeScript arrays. After editing, the site rebuilds automatically in dev mode.

---

## ♿ Accessibility

- WCAG AA compliant color contrast ratios
- Full keyboard navigation support
- ARIA labels on all interactive elements
- Skip-to-content link
- `prefers-reduced-motion` support
- Semantic HTML5 structure

---

## 🚀 Deployment

The site auto-deploys to Vercel on push to `main`:

```bash
# Or deploy manually
npx vercel --prod
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
