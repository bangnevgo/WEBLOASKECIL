import { MetadataRoute } from 'next';
import { getAllPartSlugs } from '@/lib/slug-utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://loas.nevgoinstitute.com';

  const partEntries = getAllPartSlugs().map(({ slug }) => ({
    url: `${baseUrl}/belajar/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...partEntries,
  ];
}

