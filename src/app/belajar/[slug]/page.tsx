import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPartBySlug, getAllPartSlugs } from '@/lib/slug-utils';
import PartPageClient from './part-page-client';

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Lesson access policy:
 * - Part 1 : semua lesson bebas (index 0–4)
 * - Part 2 : lesson 1 & 3 bebas (index 0 dan 2)
 * - Part 3+ : hanya lesson 1 bebas (index 0)
 */
function getFreeIndices(partId: string): number[] {
  if (partId === 'part-1') return [0, 1, 2, 3, 4];
  if (partId === 'part-2') return [0, 2];
  return [0];
}

// Generate static params untuk semua 10 bagian
export async function generateStaticParams() {
  return getAllPartSlugs().map(({ slug }) => ({ slug }));
}

// Generate metadata unik per bagian
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const part = getPartBySlug(slug);

  if (!part) return { title: 'Tidak Ditemukan' };

  const title = `${part.title} — Kurikulum Neville Goddard | Hukum Asumsi`;
  const description = part.description.slice(0, 155) + '…';
  const url = `https://loas.nevgoinstitute.com/belajar/${slug}`;

  return {
    title,
    description,
    keywords: [
      'Neville Goddard',
      'Hukum Asumsi',
      part.title,
      ...part.meta.split('·').map(s => s.trim()),
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Hukum Asumsi — Neville Goddard',
      locale: 'id_ID',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function PartPage({ params }: Props) {
  const { slug } = await params;
  const part = getPartBySlug(slug);

  if (!part) notFound();

  // Cari index part untuk prev/next navigation
  const allSlugs = getAllPartSlugs();
  const currentIndex = allSlugs.findIndex(s => s.slug === slug);
  const prevPart = currentIndex > 0 ? allSlugs[currentIndex - 1] : null;
  const nextPart = currentIndex < allSlugs.length - 1 ? allSlugs[currentIndex + 1] : null;

  const freeIndices = getFreeIndices(part.id);

  // JSON-LD Course schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: part.title,
    description: part.description,
    provider: {
      '@type': 'Organization',
      name: 'Hukum Asumsi — Nevgo Institute',
      url: 'https://loas.nevgoinstitute.com',
    },
    url: `https://loas.nevgoinstitute.com/belajar/${slug}`,
    hasCourseInstance: part.lessons.map(lesson => ({
      '@type': 'CourseInstance',
      name: lesson.title,
      description: lesson.bullets.join('. '),
    })),
    numberOfCredits: part.lessons.length,
    educationalLevel: 'Beginner to Advanced',
    inLanguage: 'id',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PartPageClient
        part={part}
        prevPart={prevPart}
        nextPart={nextPart}
        currentSlug={slug}
        freeIndices={freeIndices}
      />
    </>
  );
}
