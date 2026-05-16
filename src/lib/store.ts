import { create } from 'zustand'

type View = 'landing' | 'dashboard' | 'lesson' | 'pricing' | 'free-lesson'

interface AppState {
  view: View
  setView: (view: View) => void
  userName: string
  setUserName: (name: string) => void
  activePartId: string | null
  activeLessonNum: string | null
  openLesson: (partId: string, lessonNum: string) => void
  closeLesson: () => void
  completedLessons: Set<string>
  toggleCompleted: (lessonNum: string) => void
  isSubscribed: boolean
  subscribe: (name: string) => void
  unsubscribe: () => void
  // Freemium lesson state
  freeLessonNum: string | null
  openFreeLesson: (lessonNum: string) => void
  closeFreeLesson: () => void
  // Locked lesson modal
  lockedLesson: { num: string; title: string; bullets: string[]; partColor: string; partTitle: string } | null
  openLockedLesson: (info: { num: string; title: string; bullets: string[]; partColor: string; partTitle: string }) => void
  closeLockedLesson: () => void
}

export const useAppStore = create<AppState>((set) => ({
  view: 'landing',
  setView: (view) => set({ view }),
  userName: '',
  setUserName: (name) => set({ userName: name }),
  activePartId: null,
  activeLessonNum: null,
  openLesson: (partId, lessonNum) =>
    set({ activePartId: partId, activeLessonNum: lessonNum, view: 'lesson' }),
  closeLesson: () =>
    set({ activePartId: null, activeLessonNum: null, view: 'dashboard' }),
  completedLessons: new Set<string>(),
  toggleCompleted: (lessonNum) =>
    set((state) => {
      const next = new Set(state.completedLessons)
      if (next.has(lessonNum)) {
        next.delete(lessonNum)
      } else {
        next.add(lessonNum)
      }
      return { completedLessons: next }
    }),
  isSubscribed: false,
  subscribe: (name) =>
    set({ isSubscribed: true, userName: name, view: 'dashboard' }),
  unsubscribe: () =>
    set({
      isSubscribed: false,
      userName: '',
      view: 'landing',
      completedLessons: new Set<string>(),
    }),
  // Freemium
  freeLessonNum: null,
  openFreeLesson: (lessonNum) =>
    set({ freeLessonNum: lessonNum, view: 'free-lesson' }),
  closeFreeLesson: () =>
    set({ freeLessonNum: null, view: 'landing' }),
  // Locked modal
  lockedLesson: null,
  openLockedLesson: (info) =>
    set({ lockedLesson: info }),
  closeLockedLesson: () =>
    set({ lockedLesson: null }),
}))
