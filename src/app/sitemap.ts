import { MetadataRoute } from 'next';
import { getAllPartSlugs } from '@/lib/slug-utils';
import { ARTIKEL } from '@/lib/artikel-data';

// Tanggal konten dipublikasikan (bukan waktu build) agar `lastmod` stabil.
// Google tidak mempercayai lastmod yang berubah setiap deploy, dan memakai
// `new Date()` saat build membuat SEMUA URL terlihat berubah setiap deploy.
const CURRICULUM_LAST_MOD = '2026-08-18'; // SSG penuh + seluruh konten lesson live
const SITE_LAST_MOD = '2026-08-18';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://loas.nevgoinstitute.com';

  // 10 Part pages (kurikulum ID) — seluruh konten 50 lesson sudah di-SSR ke
  // dalam halaman part masing-masing, jadi cukup SATU URL per part.
  //
  // PENTING: jangan pernah memasukkan URL fragment (#lesson-x-y) ke sitemap.
  // Google mengabaikan fragment (bagian setelah #) dan memperlakukan
  // semuanya sebagai halaman part yang sama → 49 duplikat di GSC tanpa nilai
  // tambahan. Jika ingin tiap lesson terindex sebagai URL terpisah, buat rute
  // nyata (mis. /belajar/<part>/<lesson>) — bukan fragment.
  const partEntries = getAllPartSlugs()
    .filter((_, i) => i < 10) // hanya versi ID (10 pertama), skip duplikat EN
    .map(({ slug }) => ({
      url: `${baseUrl}/belajar/${slug}`,
      lastModified: CURRICULUM_LAST_MOD,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

  // Artikel SEO — lastmod memakai tanggal terbit asli dari data artikel
  const artikelEntries = ARTIKEL.filter((a) => a.status === 'LIVE').map(
    ({ slug, publishedAt }) => ({
      url: `${baseUrl}/artikel/${slug}`,
      lastModified: publishedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
  );

  return [
    {
      url: baseUrl,
      lastModified: SITE_LAST_MOD,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: SITE_LAST_MOD,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/artikel`,
      lastModified: SITE_LAST_MOD,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pendampingan-101.html`,
      lastModified: SITE_LAST_MOD,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...artikelEntries,
    ...partEntries,
  ];
}
