import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { OG_IMAGE, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site';

/* ─────────────────────────────────────────────
   Site-wide constants (single source of truth)
───────────────────────────────────────────── */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

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
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
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
        alt: `${SITE_NAME} – Free Online Multiplayer Bingo Game`,
        type: 'image/png',
      },
    ],
  },

  /* ── Twitter / X Card ── */
  twitter: {
    card: 'summary_large_image',
    site: '@bingogameguys',
    creator: '@bingogameguys',
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
  publisher: {
    '@id': `${SITE_URL}#organization`
  },
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
  '@id': `${SITE_URL}#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/og-image.png`,
  },
  sameAs: [
    // Add your social profile URLs here
  ],
};

const webApplicationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': `${SITE_URL}#webapp`,
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

const webPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}#webpage`,
  url: SITE_URL,
  name: SITE_TITLE,
  isPartOf: {
    '@id': `${SITE_URL}#website`
  }
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
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              websiteStructuredData,
              organizationStructuredData,
              webApplicationStructuredData,
              webPageStructuredData
            ]
          }) }}
        />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <Providers>
          <div className="relative flex min-h-screen w-full flex-col">
            <Header />
            <main id="main-content" className="flex-1" role="main">
              {children}
            </main>
            <footer role="contentinfo" aria-label="Site footer" className="py-6 md:px-8 md:py-0">
              <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground">
                  &copy; {new Date().getFullYear()} BingoGameGuys — Created by Sriram. Free online bingo game.
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
