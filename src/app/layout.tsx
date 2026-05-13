import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';

/* ─────────────────────────────────────────────
   Site-wide constants (single source of truth)
───────────────────────────────────────────── */
const SITE_URL = 'https://bingogameguys.vercel.app';
const SITE_NAME = 'BingoBlitz';
const SITE_TITLE = 'BingoBlitz – Free Online Bingo Game | Play With Friends';
const SITE_DESCRIPTION =
  'Play real-time Bingo online for free! Create custom rooms, invite friends, generate unique bingo cards, and shout BINGO together. No download needed — just fun!';
const SITE_KEYWORDS =
  'bingo game, online bingo, free bingo, multiplayer bingo, play bingo with friends, bingo room, bingo card generator, BingoBlitz, real-time bingo';
const OG_IMAGE = `${SITE_URL}/og-image.png`;

/* ─────────────────────────────────────────────
   Viewport (responsive + PWA-ready)
───────────────────────────────────────────── */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

/* ─────────────────────────────────────────────
   Root Metadata
───────────────────────────────────────────── */
export const metadata: Metadata = {
  /* ── Basic ── */
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: 'Sriram', url: SITE_URL }],
  creator: 'Sriram',
  publisher: 'BingoBlitz',
  category: 'game',
  applicationName: SITE_NAME,

  /* ── Canonical ── */
  alternates: {
    canonical: SITE_URL,
  },

  /* ── Favicon / icons ── */
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },

  /* ── Manifest (PWA) ── */
  manifest: '/manifest.json',

  /* ── Open Graph (Facebook, LinkedIn, WhatsApp, Discord) ── */
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'BingoBlitz – Free Online Multiplayer Bingo Game',
        type: 'image/png',
      },
    ],
  },

  /* ── Twitter / X Card ── */
  twitter: {
    card: 'summary_large_image',
    site: '@bingoblitz',
    creator: '@bingoblitz',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },

  /* ── Robots ── */
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

  /* ── Google Search Console verification ──
     Replace the content value with your actual verification token
     from https://search.google.com/search-console
  ── */
  verification: {
    google: '1oug0Qa_XpVqez1KCDsVTONP6qQ4MdOXpFjr63mEwwc',
    // yandex: 'REPLACE_WITH_YANDEX_TOKEN',
    // bing: 'REPLACE_WITH_BING_TOKEN',
  },
};

/* ─────────────────────────────────────────────
   JSON-LD Structured Data
───────────────────────────────────────────── */
const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
  },
  sameAs: [
    // Add your social profile URLs here
    // 'https://twitter.com/bingoblitz',
  ],
};

const webApplicationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
};

/* ─────────────────────────────────────────────
   Root Layout
───────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="1oug0Qa_XpVqez1KCDsVTONP6qQ4MdOXpFjr63mEwwc" />
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationStructuredData) }}
        />
      </head>
      <body className="font-body antialiased">
        <Providers>
          <div className="relative flex min-h-screen w-full flex-col">
            <Header />
            <main id="main-content" className="flex-1" role="main">
              {children}
            </main>
            <footer role="contentinfo" aria-label="Site footer" className="py-6 md:px-8 md:py-0">
              <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground">
                  &copy; {new Date().getFullYear()} BingoBlitz — Created by Sriram. Free online bingo game.
                </p>
              </div>
            </footer>
          </div>
          <Toaster />
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
