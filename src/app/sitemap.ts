import { MetadataRoute } from 'next';
import { getAllPartSlugs, getAllLessonSlugs } from '@/lib/slug-utils';
import { getAllArtikelSlugs } from '@/lib/artikel-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://loas.nevgoinstitute.com';
  const now = new Date();

  // 10 Part pages (full curriculum chapters)
  const partEntries = getAllPartSlugs()
    .filter((_, i) => i < 10) // hanya ID version (10 pertama), skip EN duplicates
    .map(({ slug }) => ({
      url: `${baseUrl}/belajar/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

  // 49 Lesson entries — setiap lesson sebagai URL unik via anchor
  // Google mengindeks fragment URLs dari halaman yang di-SSR
  const lessonEntries = getAllLessonSlugs().map(({ partSlug, lessonNum }) => ({
    url: `${baseUrl}/belajar/${partSlug}#lesson-${lessonNum.replace('.', '-')}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Artikel SEO
  const artikelEntries = getAllArtikelSlugs().map(({ slug }) => ({
    url: `${baseUrl}/artikel/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/artikel`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pendampingan-101.html`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...artikelEntries,
    ...partEntries,
    ...lessonEntries,
  ];
}
