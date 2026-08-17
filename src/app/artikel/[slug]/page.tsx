import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArtikelBySlug, getAllArtikelSlugs } from '@/lib/artikel-data';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-static';

export function generateStaticParams() {
  return getAllArtikelSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artikel = getArtikelBySlug(slug);
  if (!artikel) return { title: 'Tidak Ditemukan' };

  const url = `https://loas.nevgoinstitute.com/artikel/${slug}`;

  return {
    title: artikel.title,
    description: artikel.description,
    keywords: artikel.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: artikel.title,
      description: artikel.description,
      url,
      type: 'article',
      siteName: 'Hukum Asumsi — Neville Goddard',
      locale: 'id_ID',
      publishedTime: artikel.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: artikel.title,
      description: artikel.description,
    },
  };
}

export default async function ArtikelPage({ params }: Props) {
  const { slug } = await params;
  const artikel = getArtikelBySlug(slug);
  if (!artikel) notFound();

  const related = artikel.relatedSlug ? getArtikelBySlug(artikel.relatedSlug) : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: artikel.title,
    description: artikel.description,
    datePublished: artikel.publishedAt,
    inLanguage: 'id',
    mainEntityOfPage: `https://loas.nevgoinstitute.com/artikel/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Nevgo Institute',
      url: 'https://nevgoinstitute.com',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Beranda
        </Link>

        <article className="mt-6">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{artikel.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Dipublikasikan {new Date(artikel.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <p className="mt-6 text-lg leading-relaxed">{artikel.lead}</p>

          <div className="mt-8 rounded-xl border border-border bg-muted/40 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Poin Penting</h2>
            <ul className="mt-3 space-y-2">
              {artikel.takeaways.map((t, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/60" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {artikel.sections.map((section, i) => (
            <section key={i} className="mt-8">
              <h2 className="text-2xl font-semibold">{section.h2}</h2>
              {section.paragraphs.map((p, j) => (
                <p key={j} className="mt-4 leading-relaxed">
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2 leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/60" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {artikel.faq.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl font-semibold">Pertanyaan Umum</h2>
              <div className="mt-4 space-y-4">
                {artikel.faq.map((f, i) => (
                  <div key={i}>
                    <h3 className="font-semibold">{f.q}</h3>
                    <p className="mt-1 leading-relaxed text-muted-foreground">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mt-10 rounded-xl border border-border bg-muted/40 p-6 text-center">
            <h2 className="text-xl font-semibold">{artikel.cta.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{artikel.cta.body}</p>
            <a
              href={artikel.cta.url}
              className="mt-4 inline-block rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90"
            >
              Mulai Belajar Gratis
            </a>
          </div>

          {related && (
            <div className="mt-8 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">Baca juga:</p>
              <Link href={`/artikel/${related.slug}`} className="mt-1 block font-semibold hover:underline">
                {related.title}
              </Link>
            </div>
          )}
        </article>
      </main>
    </>
  );
}
