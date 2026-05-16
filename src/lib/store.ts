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

// Load persisted state from localStorage
function loadPersistedState() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('nv-app-state')
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function persistState(state: { userName: string; isSubscribed: boolean; completedLessons: string[] }) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('nv-app-state', JSON.stringify(state))
  } catch {
    // localStorage might be full or blocked
  }
}

// Initialize from persisted state
const persisted = typeof window !== 'undefined' ? loadPersistedState() : null

export const useAppStore = create<AppState>((set, get) => ({
  view: 'landing',
  setView: (view) => set({ view }),
  userName: persisted?.userName || '',
  setUserName: (name) => {
    set({ userName: name })
    persistState({ userName: name, isSubscribed: get().isSubscribed, completedLessons: [...get().completedLessons] })
  },
  activePartId: null,
  activeLessonNum: null,
  openLesson: (partId, lessonNum) =>
    set({ activePartId: partId, activeLessonNum: lessonNum, view: 'lesson' }),
  closeLesson: () =>
    set({ activePartId: null, activeLessonNum: null, view: 'dashboard' }),
  completedLessons: new Set<string>(persisted?.completedLessons || []),
  toggleCompleted: (lessonNum) =>
    set((state) => {
      const next = new Set(state.completedLessons)
      if (next.has(lessonNum)) {
        next.delete(lessonNum)
      } else {
        next.add(lessonNum)
      }
      persistState({ userName: state.userName, isSubscribed: state.isSubscribed, completedLessons: [...next] })
      return { completedLessons: next }
    }),
  isSubscribed: persisted?.isSubscribed || false,
  subscribe: (name) => {
    set({ isSubscribed: true, userName: name, view: 'dashboard' })
    persistState({ userName: name, isSubscribed: true, completedLessons: [...get().completedLessons] })
  },
  unsubscribe: () => {
    set({
      isSubscribed: false,
      userName: '',
      view: 'landing',
      completedLessons: new Set<string>(),
    })
    persistState({ userName: '', isSubscribed: false, completedLessons: [] })
  },
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
