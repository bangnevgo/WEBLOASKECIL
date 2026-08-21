import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAudioBySlug, getAllAudioSlugs } from '@/lib/audio-data'
import AudioLessonView from '@/components/audio-lesson-view'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-static'

export function generateStaticParams() {
  return getAllAudioSlugs()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const lesson = getAudioBySlug(slug)
  if (!lesson) return { title: 'Audio Tidak Ditemukan | Nevgo Institute' }

  const url = `https://loas.nevgoinstitute.com/audio/${slug}`
  const ogImageUrl = `https://loas.nevgoinstitute.com${lesson.ogImage}`
  const audioFileUrl = `https://loas.nevgoinstitute.com${lesson.audioUrl}`

  return {
    title: `${lesson.title} — Audio Eksklusif | Nevgo Institute`,
    description: lesson.description,
    keywords: [
      'hukum asumsi',
      'neville goddard indonesia',
      'audio meditasi hukum asumsi',
      'tubuh kecanduan masa lalu',
      'afirmasi batin',
      'manifestasi alami',
      'bang nevgo'
    ],
    alternates: {
      canonical: url
    },
    openGraph: {
      title: `${lesson.title} — Audio Eksklusif LOAS`,
      description: lesson.description,
      url,
      type: 'article',
      siteName: 'Nevgo Institute — Hukum Asumsi',
      locale: 'id_ID',
      publishedTime: lesson.publishedAt,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: lesson.title,
          type: 'image/png'
        }
      ],
      audio: [
        {
          url: audioFileUrl,
          type: 'audio/mpeg'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${lesson.title} — Audio Eksklusif LOAS`,
      description: lesson.description,
      images: [ogImageUrl]
    }
  }
}

export default async function AudioPage({ params }: Props) {
  const { slug } = await params
  const lesson = getAudioBySlug(slug)
  if (!lesson) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AudioObject',
        name: lesson.title,
        description: lesson.description,
        contentUrl: `https://loas.nevgoinstitute.com${lesson.audioUrl}`,
        duration: 'PT20M',
        encodingFormat: 'audio/mpeg',
        uploadDate: lesson.publishedAt,
        author: {
          '@type': 'Person',
          name: lesson.author.name,
          url: 'https://nevgoinstitute.com/#bangnevgo'
        }
      },
      {
        '@type': 'Article',
        headline: lesson.title,
        description: lesson.description,
        datePublished: lesson.publishedAt,
        inLanguage: 'id',
        mainEntityOfPage: `https://loas.nevgoinstitute.com/audio/${slug}`,
        image: `https://loas.nevgoinstitute.com${lesson.ogImage}`,
        author: {
          '@type': 'Person',
          name: lesson.author.name,
          url: 'https://nevgoinstitute.com/#bangnevgo',
          sameAs: [
            'https://www.tiktok.com/@bangnevgo',
            'https://www.youtube.com/@bangnevgo',
            'https://www.instagram.com/nevgoinstitute/'
          ]
        },
        publisher: {
          '@type': 'Organization',
          name: 'Nevgo Institute',
          url: 'https://nevgoinstitute.com',
          logo: 'https://nevgoinstitute.com/assets/images/nevgo-logo-512.png'
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://loas.nevgoinstitute.com'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Audio',
            item: 'https://loas.nevgoinstitute.com/#knowledge-bank'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: lesson.title,
            item: `https://loas.nevgoinstitute.com/audio/${slug}`
          }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: lesson.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AudioLessonView lesson={lesson} />
    </>
  )
}
