# Paras Negi Portfolio Website

A sophisticated, interactive portfolio website built with **Next.js 14**, featuring a Spider Web Canvas visualization, D3.js Force Graph, smooth GSAP animations, and a Claude-inspired dark design system.

## 🚀 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5+ (strict mode) |
| Styling | Tailwind CSS 4 + CSS Custom Properties |
| Animations | GSAP 3 + ScrollTrigger, Framer Motion |
| Visualizations | HTML5 Canvas API, D3.js v7 |
| Smooth Scroll | Lenis |
| Icons | Lucide React |
| Fonts | DM Serif Display, DM Sans, JetBrains Mono |
| Deployment | Vercel |

## 📂 Project Structure

```
app/
├── layout.tsx              # Root layout with SEO metadata and fonts
├── page.tsx                # Main portfolio page
├── globals.css             # Design system + CSS custom properties
├── sitemap.ts              # SEO sitemap
├── robots.ts               # robots.txt configuration
├── components/
│   ├── sections/           # Page sections
│   │   ├── Navbar.tsx      # Fixed nav with frosted glass effect
│   │   ├── Hero.tsx        # Full-viewport hero with Spider Web Canvas
│   │   ├── About.tsx       # 60/40 split layout with animated counters
│   │   ├── Skills.tsx      # D3.js Force Graph visualization
│   │   ├── Experience.tsx  # Animated vertical timeline
│   │   ├── Projects.tsx    # Masonry card grid
│   │   ├── Education.tsx   # Education cards + certification badges
│   │   ├── Contact.tsx     # CTA with clipboard copy
│   │   └── Footer.tsx      # Footer with scroll-to-top
│   ├── canvas/             # Canvas visualizations
│   │   ├── SpiderWebCanvas.tsx  # Interactive HTML5 Canvas
│   │   └── ForceGraph.tsx       # D3.js physics simulation
│   └── ui/                 # Reusable UI components
│       ├── Card.tsx        # Dark surface card
│       ├── Button.tsx      # Button variants
│       ├── Toast.tsx       # Toast notifications
│       └── Badge.tsx       # Pill-shaped tags
└── lib/
    ├── data/               # Content data files
    │   ├── types.ts        # TypeScript interfaces
    │   ├── projects.ts     # Project data
    │   ├── experience.ts   # Work experience
    │   ├── skills.ts       # Skills by category
    │   └── education.ts    # Education + certifications
    ├── hooks/              # Custom React hooks
    │   ├── useSpiderWeb.ts    # Canvas physics logic
    │   ├── useScrollPosition.ts
    │   └── useSmoothScroll.ts
    └── utils/
        └── animation.ts    # GSAP helper functions
```

## 🎨 Design System

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| Surface Primary | `#0d0d0c` | Main background |
| Surface Secondary | `#1a1a18` | Cards, navbar |
| Surface Tertiary | `#2a2a28` | Hover states |
| Text Primary | `#f0ede6` | Main text |
| Text Secondary | `#888884` | Muted text |
| Accent Orange | `#e07040` | Links, highlights |
| Accent Cream | `#c8b89a` | Decorative elements |
| Border | `#3a3a38` | Subtle borders |

### Typography

| Element | Font | Size |
|---------|------|------|
| Hero H1 | DM Serif Display | `clamp(40px, 6vw, 80px)` |
| Section H2 | DM Serif Display | `clamp(28px, 3.5vw, 48px)` |
| Body | DM Sans 400 | 16px |
| Code | JetBrains Mono | 14px |

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/parasnegi783/portfolio.git
cd portfolio

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

## 📝 Updating Content

All content is stored in typed data files under `app/lib/data/`:

- **Projects**: Edit `projects.ts` — add/modify/remove projects
- **Experience**: Edit `experience.ts` — update work history
- **Skills**: Edit `skills.ts` — add skills with categories
- **Education**: Edit `education.ts` — update degrees and certifications

Each file exports typed TypeScript arrays. After editing, rebuild the project.

## ♿ Accessibility

- WCAG AA compliant color contrast ratios
- Full keyboard navigation support
- ARIA labels on all interactive elements
- Skip-to-content link
- `prefers-reduced-motion` support
- Semantic HTML structure

## 🚀 Deployment

Deploy to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect the GitHub repository to Vercel for automatic deployments on push.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
