import type { Metadata } from 'next';
import { HomePageClient } from '@/components/home-page-client';

const SITE_URL = 'https://bingogameguys.vercel.app';

export const metadata: Metadata = {
  title: 'BingoBlitz – Free Online Bingo Game | Play With Friends',
  description:
    'Play real-time Bingo online for free! Create custom rooms, invite friends, generate unique bingo cards, and shout BINGO together. No download needed — just fun!',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'BingoBlitz – Free Online Bingo Game | Play With Friends',
    description:
      'Play real-time Bingo online for free! Create custom rooms, invite friends, generate unique bingo cards, and shout BINGO together. No download needed — just fun!',
    url: SITE_URL,
    type: 'website',
  },
};

/* Page-specific JSON-LD: WebPage + BreadcrumbList */
const webPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}/#webpage`,
  url: SITE_URL,
  name: 'BingoBlitz – Free Online Bingo Game',
  description:
    'Play real-time Bingo online for free! Create custom rooms, invite friends, generate unique bingo cards, and shout BINGO together.',
  isPartOf: { '@id': `${SITE_URL}/#website` },
  inLanguage: 'en-US',
  potentialAction: {
    '@type': 'ReadAction',
    target: [SITE_URL],
  },
};

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <HomePageClient />
    </>
  );
}
