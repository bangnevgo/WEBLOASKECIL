import { ALL_PARTS } from './curriculum-data'

export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // hapus karakter non-alphanumeric
    .replace(/\s+/g, '-')          // spasi → dash
    .replace(/-+/g, '-')           // multiple dash → single
    .replace(/^-|-$/g, '')         // trim dash di awal/akhir
}

export function slugToPartId(slug: string): string | null {
  const match = ALL_PARTS.find(p => titleToSlug(p.title) === slug)
  return match?.id ?? null
}

export function getPartBySlug(slug: string) {
  return ALL_PARTS.find(p => titleToSlug(p.title) === slug) ?? null
}

export function getAllPartSlugs(): { slug: string; partId: string; title: string }[] {
  return ALL_PARTS.map(p => ({
    slug: titleToSlug(p.title),
    partId: p.id,
    title: p.title,
  }))
}
