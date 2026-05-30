import { Metadata } from 'next';
import HomeClient from '@/components/home-client';

export const metadata: Metadata = {
  title: 'Neville Goddard — Hukum Asumsi | Kurikulum Lengkap',
  description:
    'Pelajari Hukum Asumsi dari Neville Goddard melalui kurikulum terstruktur: 10 bagian, 49 pelajaran, praktik harian, dan kutipan bersumber dari seluruh karyanya.',
  openGraph: {
    title: 'Neville Goddard — Hukum Asumsi',
    description:
      'Kurikulum lengkap ajaran Neville Goddard: 10 bagian, 49 pelajaran, praktik harian, dan kutipan bersumber.',
    url: 'https://loas.nevgoinstitute.com',
    siteName: 'Hukum Asumsi — Neville Goddard',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neville Goddard — Hukum Asumsi',
    description:
      'Kurikulum lengkap ajaran Neville Goddard: 10 bagian, 49 pelajaran, praktik harian.',
  },
  alternates: {
    canonical: 'https://loas.nevgoinstitute.com',
  },
};

export default function Home() {
  return <HomeClient />;
}
