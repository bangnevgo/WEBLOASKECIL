import { ALL_PARTS as ALL_PARTS_ID } from './curriculum-data'
import { ALL_PARTS_EN } from './curriculum-data-en'

export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // hapus karakter non-alphanumeric
    .replace(/\s+/g, '-')          // spasi → dash
    .replace(/-+/g, '-')           // multiple dash → single
    .replace(/^-|-$/g, '')         // trim dash di awal/akhir
}

export function slugToPartId(slug: string): string | null {
  const matchId = ALL_PARTS_ID.find(p => titleToSlug(p.title) === slug)
  if (matchId) return matchId.id
  const matchEn = ALL_PARTS_EN.find(p => titleToSlug(p.title) === slug)
  return matchEn?.id ?? null
}

export function getPartBySlug(slug: string) {
  // Check both Indonesian and English titles to resolve slug
  const matchId = ALL_PARTS_ID.find(p => titleToSlug(p.title) === slug)
  if (matchId) return matchId
  
  const matchEn = ALL_PARTS_EN.find(p => titleToSlug(p.title) === slug)
  if (matchEn) {
    // If it matches English, return the Indonesian one from ALL_PARTS_ID 
    // to preserve structure, PartPageClient will resolve it to English on the client.
    return ALL_PARTS_ID.find(p => p.id === matchEn.id) ?? null
  }
  return null
}

export function getAllPartSlugs(): { slug: string; partId: string; title: string }[] {
  // Return all slugs (both Indonesian and English versions to be fully supported in routes)
  const idSlugs = ALL_PARTS_ID.map(p => ({
    slug: titleToSlug(p.title),
    partId: p.id,
    title: p.title,
  }))
  const enSlugs = ALL_PARTS_EN.map(p => ({
    slug: titleToSlug(p.title),
    partId: p.id,
    title: p.title,
  }))
  return [...idSlugs, ...enSlugs]
}

export function getAllLessonSlugs(): { partSlug: string; lessonNum: string; lessonTitle: string; partTitle: string }[] {
  const results: { partSlug: string; lessonNum: string; lessonTitle: string; partTitle: string }[] = []
  for (const part of ALL_PARTS_ID) {
    const partSlug = titleToSlug(part.title)
    for (const lesson of part.lessons) {
      results.push({
        partSlug,
        lessonNum: lesson.num,
        lessonTitle: lesson.title,
        partTitle: part.title,
      })
    }
  }
  return results
}

