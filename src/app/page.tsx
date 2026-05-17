import { HomePageClient } from '@/components/home-page-client';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site';

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <header className="sr-only">
        <h1>{SITE_NAME}</h1>
        <p>{SITE_TITLE}</p>
        <p>{SITE_DESCRIPTION}</p>
      </header>
      <HomePageClient />
    </>
  );
}
