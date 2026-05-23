import { create } from 'zustand'

type View = 'landing' | 'dashboard' | 'lesson' | 'pricing' | 'free-lesson' | 'ai-manifestation' | 'ai-limiting-belief' | 'ai-shadow' | 'ai-private-session' | 'admin' | 'community'
export type SubscriptionTier = 'free' | 'pelajar' | 'premium' | 'master'

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
  subscriptionTier: SubscriptionTier
  setSubscriptionTier: (tier: SubscriptionTier, name: string) => void
  unsubscribe: () => void
  /** Check if user has full curriculum access (Pelajar tier or higher OR admin) */
  hasCurriculumAccess: () => boolean
  /** Check if user has community access (Premium tier or higher OR admin) */
  hasCommunityAccess: () => boolean
  // Admin mode
  isAdmin: boolean
  setAdmin: (admin: boolean) => void
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

function persistState(state: { userName: string; subscriptionTier: SubscriptionTier; isAdmin: boolean; completedLessons: string[] }) {
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
    persistState({
      userName: name,
      subscriptionTier: get().subscriptionTier,
      isAdmin: get().isAdmin,
      completedLessons: [...get().completedLessons]
    })
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
      persistState({
        userName: state.userName,
        subscriptionTier: state.subscriptionTier,
        isAdmin: state.isAdmin,
        completedLessons: [...next]
      })
      return { completedLessons: next }
    }),
  subscriptionTier: (persisted?.subscriptionTier || 'free') as SubscriptionTier,
  setSubscriptionTier: (tier: SubscriptionTier, name: string) => {
    set({ subscriptionTier: tier, userName: name, view: 'dashboard' })
    persistState({
      userName: name,
      subscriptionTier: tier,
      isAdmin: get().isAdmin,
      completedLessons: [...get().completedLessons]
    })
  },
  unsubscribe: () => {
    set({
      subscriptionTier: 'free',
      userName: '',
      view: 'landing',
      completedLessons: new Set<string>(),
    })
    persistState({
      userName: '',
      subscriptionTier: 'free',
      isAdmin: false,
      completedLessons: []
    })
  },
  /** Check if user has full curriculum access (Pelajar tier or higher OR admin) */
  hasCurriculumAccess: () => {
    const state = get()
    // Admin gets full access regardless of subscription tier
    if (state.isAdmin) return true
    // Regular users need appropriate tier
    return state.subscriptionTier === 'pelajar' || state.subscriptionTier === 'premium' || state.subscriptionTier === 'master'
  },
  /** Check if user has community access (Premium tier or higher OR admin) */
  hasCommunityAccess: () => {
    const state = get()
    // Admin gets community access regardless of subscription tier
    if (state.isAdmin) return true
    // Regular users need premium or master
    return state.subscriptionTier === 'premium' || state.subscriptionTier === 'master'
  },
  // Admin mode
  isAdmin: persisted?.isAdmin || false,
  setAdmin: (admin) => {
    set({
      isAdmin: admin,
      // Jika admin, otomatis set ke master tier
      subscriptionTier: admin ? 'master' : get().subscriptionTier
    })
    persistState({
      userName: get().userName,
      subscriptionTier: get().subscriptionTier,
      isAdmin: admin,
      completedLessons: [...get().completedLessons]
    })
  },
  // Freemium lesson state
  freeLessonNum: null,
  openFreeLesson: (lessonNum) =>
    set({ freeLessonNum: lessonNum, view: 'free-lesson' }),
  closeFreeLesson: () =>
    set({ freeLessonNum: null, view: 'landing' }),
  // Locked lesson modal
  lockedLesson: null,
  openLockedLesson: (info) =>
    set({ lockedLesson: info }),
  closeLockedLesson: () =>
    set({ lockedLesson: null }),
}))
