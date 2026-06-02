import { MetadataRoute } from 'next';
import { getAllPartSlugs } from '@/lib/slug-utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://loas.nevgoinstitute.com';

  const partPages: MetadataRoute.Sitemap = getAllPartSlugs().map((p) => ({
    url: `${baseUrl}/belajar/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...partPages,
  ];
}
