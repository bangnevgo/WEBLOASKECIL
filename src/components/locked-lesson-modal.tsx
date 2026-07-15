'use client'

import { useAppStore } from '@/lib/store'

export default function LockedLessonModal() {
  const { lockedLesson } = useAppStore()
  if (!lockedLesson) return null
  return null // Semua konten gratis — modal tidak pernah muncul
}
