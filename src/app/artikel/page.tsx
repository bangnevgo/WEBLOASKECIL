import { Metadata } from 'next';
import Link from 'next/link';
import { ARTIKEL } from '@/lib/artikel-data';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Artikel — Hukum Asumsi & Neville Goddard | LOAS',
  description:
    'Kumpulan artikel tentang Hukum Asumsi, Teknik Revisi, SATS, dan ajaran Neville Goddard dalam bahasa Indonesia. Pelajari dan praktikkan — gratis.',
  alternates: { canonical: 'https://loas.nevgoinstitute.com/artikel' },
  openGraph: {
    title: 'Artikel — Hukum Asumsi & Neville Goddard',
    description: 'Artikel tentang Hukum Asumsi, Teknik Revisi, SATS, dan ajaran Neville Goddard dalam bahasa Indonesia.',
    type: 'website',
    siteName: 'Hukum Asumsi — Neville Goddard',
    locale: 'id_ID',
    url: 'https://loas.nevgoinstitute.com/artikel',
  },
};

export default function ArtikelIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Beranda
      </Link>

      <h1 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl">Artikel Hukum Asumsi</h1>
      <p className="mt-3 text-muted-foreground">
        Belajar Neville Goddard dalam bahasa Indonesia: konsep inti, teknik praktik, dan panduan langkah demi langkah.
      </p>

      <div className="mt-8 space-y-4">
        {ARTIKEL.map((artikel) => (
          <Link
            key={artikel.slug}
            href={`/artikel/${artikel.slug}`}
            className="block rounded-xl border border-border p-5 transition hover:border-foreground/40"
          >
            <h2 className="text-xl font-semibold">{artikel.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{artikel.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
