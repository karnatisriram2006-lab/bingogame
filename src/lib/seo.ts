/**
 * SEO Utility Functions
 * Centralises all SEO metadata construction for BingoBlitz.
 * Use these helpers in page.tsx / layout.tsx `generateMetadata` exports.
 */

import type { Metadata } from 'next';

const SITE_URL = 'https://bingogameguys.vercel.app';
const SITE_NAME = 'BingoBlitz';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface SeoParams {
  title: string;
  description: string;
  /** Relative path, e.g. '/room/abc123'. Defaults to site root. */
  path?: string;
  /** Override the OG image URL */
  image?: string;
  /** Set to true for private/dynamic pages that should not be indexed */
  noIndex?: boolean;
  /** Additional keywords to append */
  keywords?: string[];
}

/**
 * Build a fully typed Next.js Metadata object for any page.
 *
 * @example
 * // src/app/some-page/page.tsx
 * export const metadata = buildSeoMetadata({
 *   title: 'How to Play Bingo',
 *   description: 'Learn how to play BingoBlitz in minutes...',
 *   path: '/how-to-play',
 * });
 */
export function buildSeoMetadata({
  title,
  description,
  path = '',
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  keywords = [],
}: SeoParams): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  const baseKeywords = [
    'bingo game',
    'online bingo',
    'free bingo',
    'multiplayer bingo',
    'play bingo with friends',
    'BingoBlitz',
  ];

  return {
    title: fullTitle,
    description,
    keywords: [...baseKeywords, ...keywords].join(', '),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} – ${SITE_NAME}`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@bingoblitz',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
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
}

/**
 * Build JSON-LD structured data for a BreadcrumbList.
 * Pass an ordered array of { name, path } breadcrumb items.
 *
 * @example
 * const ld = buildBreadcrumbLd([
 *   { name: 'Home', path: '/' },
 *   { name: 'How To Play', path: '/how-to-play' },
 * ]);
 */
export function buildBreadcrumbLd(
  items: Array<{ name: string; path: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/**
 * Build JSON-LD structured data for a WebPage.
 */
export function buildWebPageLd({
  title,
  description,
  path = '',
}: {
  title: string;
  description: string;
  path?: string;
}): object {
  const url = `${SITE_URL}${path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}/#webpage`,
    url,
    name: title,
    description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'ReadAction',
      target: [url],
    },
  };
}
