import { create } from 'zustand'

type View = 'landing' | 'dashboard' | 'lesson' | 'pricing'

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
}))
