import type { Metadata } from 'next';
import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { TubesCursor } from '@/app/components/canvas/TubesCursor';

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
  title: 'Paras Negi | Full-Stack Developer Portfolio',
  description:
    'Full-Stack Developer specializing in Python, React.js, Django, Node.js, and MERN Stack. View projects, experience, and skills.',
  keywords: [
    'Paras Negi',
    'Full-Stack Developer',
    'React.js',
    'Django',
    'Node.js',
    'Python',
    'MERN Stack',
    'Portfolio',
  ],
  authors: [{ name: 'Paras Negi' }],
  creator: 'Paras Negi',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://parasnegi.vercel.app',
    title: 'Paras Negi | Full-Stack Developer Portfolio',
    description:
      'Full-Stack Developer specializing in Python, React.js, Django, Node.js, and MERN Stack. View projects, experience, and skills.',
    siteName: 'Paras Negi Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paras Negi | Full-Stack Developer Portfolio',
    description:
      'Full-Stack Developer specializing in Python, React.js, Django, Node.js, and MERN Stack.',
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
              jobTitle: 'Full-Stack Developer',
              alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'Amritsar Group of Colleges',
              },
              knowsAbout: [
                'React.js',
                'Node.js',
                'Django',
                'Python',
                'JavaScript',
                'MongoDB',
                'MySQL',
              ],
              sameAs: [
                'https://github.com/parasnegi783',
                'https://linkedin.com/in/parasnegi783',
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full antialiased overflow-x-hidden">
        <TubesCursor />
        {children}
      </body>
    </html>
  );
}
