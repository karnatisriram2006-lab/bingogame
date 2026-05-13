import type { MetadataRoute } from 'next';

const SITE_URL = 'https://bingogameguys.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // Add more public routes here as your app grows
    // Example:
    // {
    //   url: `${SITE_URL}/how-to-play`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
  ];
}
