'use client';

import Link from 'next/link';
import { PartFull, ALL_PARTS as ALL_PARTS_ID } from '@/lib/curriculum-data';
import { ALL_PARTS_EN } from '@/lib/curriculum-data-en';
import { titleToSlug } from '@/lib/slug-utils';
import { useTranslation } from '@/lib/translations';

interface Props {
  part: PartFull;
  prevPart: { slug: string; title: string; partId?: string } | null;
  nextPart: { slug: string; title: string; partId?: string } | null;
  currentSlug: string;
}

export default function PartPageClient({ part, prevPart, nextPart }: Props) {
  const { language } = useTranslation();

  // Resolve part to active language version
  const activePart = language === 'en'
    ? (ALL_PARTS_EN.find(p => p.id === part.id) || part)
    : part;

  const getPartSlug = (partId?: string) => {
    if (!partId) return '';
    const targetPart = language === 'en'
      ? ALL_PARTS_EN.find(p => p.id === partId)
      : ALL_PARTS_ID.find(p => p.id === partId);
    return targetPart ? titleToSlug(targetPart.title) : '';
  };

  const getPartTitle = (partId?: string, defaultTitle?: string) => {
    if (!partId) return defaultTitle || '';
    const targetPart = language === 'en'
      ? ALL_PARTS_EN.find(p => p.id === partId)
      : ALL_PARTS_ID.find(p => p.id === partId);
    return targetPart ? targetPart.title : (defaultTitle || '');
  };

  const prevSlug = prevPart?.partId ? getPartSlug(prevPart.partId) : prevPart?.slug;
  const prevTitle = prevPart?.partId ? getPartTitle(prevPart.partId, prevPart.title) : prevPart?.title;
  
  const nextSlug = nextPart?.partId ? getPartSlug(nextPart.partId) : nextPart?.slug;
  const nextTitle = nextPart?.partId ? getPartTitle(nextPart.partId, nextPart.title) : nextPart?.title;

  return (
    <div className="nv-part-page">
      {/* Header breadcrumb */}
      <nav className="nv-part-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">{language === 'en' ? 'Law of Assumption' : 'Hukum Asumsi'}</Link>
        <span aria-hidden="true">›</span>
        <span>{language === 'en' ? `Part ${activePart.num}` : `Bagian ${activePart.num}`}</span>
      </nav>

      {/* Hero section */}
      <header className="nv-part-hero">
        <div className="nv-part-num">{language === 'en' ? `PART ${activePart.num}` : `BAGIAN ${activePart.num}`}</div>
        <h1 className="nv-part-title">{activePart.title}</h1>
        <p className="nv-part-meta">{activePart.meta}</p>
        <p className="nv-part-description">{activePart.description}</p>
        <blockquote className="nv-part-quote">
          <p>"{activePart.partQuote.text}"</p>
          <cite>— {activePart.partQuote.source}</cite>
        </blockquote>
      </header>

      {/* Lesson list */}
      <section className="nv-part-lessons" aria-labelledby="lessons-heading">
        <h2 id="lessons-heading" className="nv-part-lessons-heading">
          {language === 'en' 
            ? `${activePart.lessons.length} Lessons in This Part`
            : `${activePart.lessons.length} Pelajaran dalam Bagian Ini`
          }
        </h2>
        <ol className="nv-lessons-list">
          {activePart.lessons.map((lesson, i) => (
            <li key={lesson.num} className="nv-lesson-item">
              <div className="nv-lesson-num">{lesson.num}</div>
              <div className="nv-lesson-content">
                <h3 className="nv-lesson-title">{lesson.title}</h3>
                <ul className="nv-lesson-bullets" aria-label={language === 'en' ? 'Main points of lesson' : 'Poin utama pelajaran'}>
                  {lesson.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
                {lesson.quotes[0] && (
                  <blockquote className="nv-lesson-quote">
                    <p>"{lesson.quotes[0].translation && language !== 'en' ? lesson.quotes[0].translation : lesson.quotes[0].text}"</p>
                    <cite>— {lesson.quotes[0].source}</cite>
                  </blockquote>
                )}
                <div className="nv-lesson-practice">
                  <strong>{language === 'en' ? 'Practice:' : 'Praktik:'}</strong> {lesson.practice}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="nv-part-cta">
        <p>
          {language === 'en'
            ? `Get full access to all ${activePart.lessons.length} lessons in this part including full teachings, sourced quotes, and daily practices.`
            : `Dapatkan akses penuh ke semua ${activePart.lessons.length} pelajaran dalam bagian ini beserta konten lengkap, kutipan bersumber, dan praktik harian.`
          }
        </p>
        <Link href="/#pricing" className="nv-part-cta-btn">
          ✦ {language === 'en' ? 'View Subscription Plans' : 'Lihat Paket Berlangganan'}
        </Link>
        <Link href="/" className="nv-part-back">
          {language === 'en' ? '← Back to Complete Curriculum' : '← Kembali ke Kurikulum Lengkap'}
        </Link>
      </section>

      {/* Prev/Next navigation */}
      <nav className="nv-part-nav" aria-label={language === 'en' ? 'Part navigation' : 'Navigasi bagian'}>
        {prevPart ? (
          <Link href={`/belajar/${prevSlug}`} className="nv-part-nav-prev">
            <span>← {language === 'en' ? 'Previous Part' : 'Bagian Sebelumnya'}</span>
            <strong>{prevTitle}</strong>
          </Link>
        ) : <div />}
        {nextPart ? (
          <Link href={`/belajar/${nextSlug}`} className="nv-part-nav-next">
            <span>{language === 'en' ? 'Next Part →' : 'Bagian Berikutnya →'}</span>
            <strong>{nextTitle}</strong>
          </Link>
        ) : <div />}
      </nav>

      <style>{`
        .nv-part-page {
          min-height: 100vh;
          background: #000;
          color: #e8d5a3;
          font-family: 'Georgia', serif;
          max-width: 860px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }

        /* Breadcrumb */
        .nv-part-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #a08840;
          margin-bottom: 2.5rem;
          letter-spacing: 0.05em;
        }
        .nv-part-breadcrumb a {
          color: #c9a84c;
          text-decoration: none;
        }
        .nv-part-breadcrumb a:hover { text-decoration: underline; }

        /* Hero */
        .nv-part-hero {
          border-top: 1px solid #c9a84c33;
          padding-top: 2.5rem;
          margin-bottom: 3rem;
        }
        .nv-part-num {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          color: #c9a84c;
          margin-bottom: 0.75rem;
          font-family: 'Georgia', serif;
        }
        .nv-part-title {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: normal;
          color: #f0dfa0;
          line-height: 1.2;
          margin: 0 0 0.75rem;
          letter-spacing: -0.01em;
        }
        .nv-part-meta {
          font-size: 0.85rem;
          color: #c9a84c;
          letter-spacing: 0.1em;
          margin-bottom: 1.5rem;
          font-style: italic;
        }
        .nv-part-description {
          font-size: 1.05rem;
          line-height: 1.75;
          color: #d4b87a;
          margin-bottom: 2rem;
        }
        .nv-part-quote {
          border-left: 2px solid #c9a84c;
          margin: 0;
          padding: 1rem 1.5rem;
          background: #0a0a0a;
        }
        .nv-part-quote p {
          font-size: 1rem;
          font-style: italic;
          color: #e8d5a3;
          margin: 0 0 0.5rem;
          line-height: 1.65;
        }
        .nv-part-quote cite {
          font-size: 0.8rem;
          color: #a08840;
          font-style: normal;
        }

        /* Lessons */
        .nv-part-lessons {
          margin-bottom: 3rem;
        }
        .nv-part-lessons-heading {
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          color: #c9a84c;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          font-weight: normal;
        }
        .nv-lessons-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .nv-lesson-item {
          display: flex;
          gap: 1.5rem;
          padding: 1.75rem 0;
          border-bottom: 1px solid #1a1a1a;
        }
        .nv-lesson-num {
          font-size: 0.8rem;
          color: #c9a84c;
          letter-spacing: 0.1em;
          min-width: 2.5rem;
          padding-top: 0.2rem;
          font-family: 'Georgia', serif;
        }
        .nv-lesson-content { flex: 1; }
        .nv-lesson-title {
          font-size: 1.15rem;
          font-weight: normal;
          color: #f0dfa0;
          margin: 0 0 0.75rem;
        }
        .nv-lesson-bullets {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .nv-lesson-bullets li {
          font-size: 0.9rem;
          color: #b09060;
          padding-left: 1rem;
          position: relative;
        }
        .nv-lesson-bullets li::before {
          content: '·';
          position: absolute;
          left: 0;
          color: #c9a84c;
        }
        .nv-lesson-quote {
          border-left: 1px solid #c9a84c55;
          margin: 0.75rem 0 1rem;
          padding: 0.6rem 1rem;
        }
        .nv-lesson-quote p {
          font-size: 0.88rem;
          font-style: italic;
          color: #c0a060;
          margin: 0 0 0.3rem;
          line-height: 1.6;
        }
        .nv-lesson-quote cite {
          font-size: 0.75rem;
          color: #806830;
          font-style: normal;
        }
        .nv-lesson-practice {
          font-size: 0.88rem;
          color: #907840;
          line-height: 1.65;
          background: #0a0800;
          padding: 0.75rem 1rem;
          border-radius: 4px;
        }
        .nv-lesson-practice strong {
          color: #c9a84c;
        }

        /* CTA */
        .nv-part-cta {
          text-align: center;
          padding: 2.5rem;
          border: 1px solid #c9a84c33;
          margin-bottom: 3rem;
          background: #050400;
        }
        .nv-part-cta p {
          color: #d4b87a;
          margin-bottom: 1.5rem;
          line-height: 1.65;
        }
        .nv-part-cta-btn {
          display: inline-block;
          background: #c9a84c;
          color: #000;
          padding: 0.75rem 2rem;
          text-decoration: none;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
          transition: opacity 0.2s;
        }
        .nv-part-cta-btn:hover { opacity: 0.85; }
        .nv-part-back {
          display: block;
          color: #806830;
          text-decoration: none;
          font-size: 0.85rem;
          margin-top: 0.75rem;
        }
        .nv-part-back:hover { color: #c9a84c; }

        /* Prev/Next nav */
        .nv-part-nav {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          border-top: 1px solid #1a1a1a;
          padding-top: 2rem;
        }
        .nv-part-nav-prev,
        .nv-part-nav-next {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          text-decoration: none;
          max-width: 45%;
        }
        .nv-part-nav-next { text-align: right; }
        .nv-part-nav-prev span,
        .nv-part-nav-next span {
          font-size: 0.75rem;
          color: #806830;
          letter-spacing: 0.05em;
        }
        .nv-part-nav-prev strong,
        .nv-part-nav-next strong {
          font-size: 0.9rem;
          color: #c9a84c;
          font-weight: normal;
          line-height: 1.4;
        }
        .nv-part-nav-prev:hover strong,
        .nv-part-nav-next:hover strong {
          color: #f0dfa0;
        }

        @media (max-width: 600px) {
          .nv-part-page { padding: 1.5rem 1rem 3rem; }
          .nv-lesson-item { flex-direction: column; gap: 0.5rem; }
          .nv-lesson-num { min-width: auto; }
          .nv-part-nav { flex-direction: column; }
          .nv-part-nav-prev,
          .nv-part-nav-next { max-width: 100%; text-align: left; }
        }
      `}</style>
    </div>
  );
}
