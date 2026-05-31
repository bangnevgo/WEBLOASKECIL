import CommunityPage from '@/components/community/CommunityPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Komunitas Privat - Hukum Asumsi | Neville Goddard',
  description:
    'Bergabung dengan komunitas eksklusif Hukum Asumsi. Diskusi, support system, dan tersambung dengan sesama pencari kebenaran.',
  keywords: ['komunitas', 'diskusi', 'hukum asumsi', 'neville goddard', 'manifestasi'],
  openGraph: {
    title: 'Komunitas Privat - Hukum Asumsi',
    description: 'Bergabung dengan komunitas eksklusif Hukum Asumsi. Diskusi, support system, dan tersambung dengan sesama pencari kebenaran.',
    type: 'website',
    url: 'https://loas.nevgoinstitute.com/community',
    images: [
      {
        url: '/community-cover.png',
        width: 1200,
        height: 630,
        alt: 'Komunitas Hukum Asumsi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Komunitas Privat - Hukum Asumsi',
    description: 'Bergabung dengan komunitas eksklusif Hukum Asumsi',
    images: ['/community-cover.png'],
  },
  alternates: {
    canonical: 'https://loas.nevgoinstitute.com/community',
  },
}

export default function Community() {
  return <CommunityPage />
}