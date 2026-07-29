import type { Metadata } from 'next';
import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { TubesCursor } from '@/app/components/canvas/TubesCursor';
import { KleinBottleBackground } from '@/app/components/canvas/KleinBottleBackground';
import { GSAPProvider } from '@/app/components/providers/GSAPProvider';

// DM Serif Display for hero and section headlines
const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

// DM Sans for UI and body text
const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// JetBrains Mono for code snippets
const jetbrainsMono = JetBrains_Mono({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Paras Negi | Enterprise Integration & Full-Stack Developer Portfolio',
  description:
    'Enterprise Integration & Full-Stack Developer specializing in MuleSoft 4, Python, Claude AI, Glean AI, React.js, and enterprise API design.',
  keywords: [
    'Paras Negi',
    'Enterprise Integration Engineer',
    'Full-Stack Developer',
    'MuleSoft 4',
    'Python',
    'Glean AI',
    'Claude AI',
    'REST APIs',
    'React.js',
    'Django',
    'Portfolio',
  ],
  authors: [{ name: 'Paras Negi' }],
  creator: 'Paras Negi',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://parasnegi.vercel.app',
    title: 'Paras Negi | Enterprise Integration & Full-Stack Developer Portfolio',
    description:
      'Enterprise Integration & Full-Stack Developer specializing in MuleSoft 4, Python, Claude AI, Glean AI, React.js, and enterprise API design.',
    siteName: 'Paras Negi Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paras Negi | Enterprise Integration & Full-Stack Developer Portfolio',
    description:
      'Enterprise Integration & Full-Stack Developer specializing in MuleSoft 4, Python, Claude AI, Glean AI, React.js, and enterprise API design.',
    creator: '@parasnegi783',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const saved = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', saved);
          } catch (_) {}
        ` }} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://parasnegi.vercel.app" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Paras Negi',
              url: 'https://parasnegi.vercel.app',
              email: 'parasnegi783@gmail.com',
              jobTitle: 'Enterprise Integration & Full-Stack Developer',
              alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'Amritsar Group of Colleges',
              },
              knowsAbout: [
                'MuleSoft 4',
                'Python',
                'Glean AI',
                'Claude AI',
                'React.js',
                'Django',
                'REST APIs',
                'Enterprise Integrations',
              ],
              sameAs: [
                'https://github.com/parasnegi783',
                'https://www.linkedin.com/in/paras-negi7/',
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full antialiased">
        {/* Site-wide 4D Klein bottle background (dark mode only).
            Must stay outside GSAPProvider: ScrollSmoother transforms
            #smooth-content, which would break position: fixed. */}
        <KleinBottleBackground />
        <TubesCursor />
        <GSAPProvider>{children}</GSAPProvider>
      </body>
    </html>
  );
}

