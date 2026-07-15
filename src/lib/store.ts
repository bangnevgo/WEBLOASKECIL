import { create } from 'zustand'

type View =
  | 'landing'
  | 'dashboard'
  | 'lesson'
  | 'free-lesson'
  | 'ai-manifestation'
  | 'ai-limiting-belief'
  | 'ai-shadow'
  | 'ai-private-session'
  | 'community'
  | 'login'
  | 'register'

export type SubscriptionTier = 'free'

interface SimulatedUser {
  name: string
  email: string
  passwordHash: string
  tier: SubscriptionTier
  completedLessons: string[]
}

interface LeadData {
  name: string
  email: string
  phone: string
}

interface AppState {
  view: View
  setView: (view: View) => void
  userName: string
  userEmail: string
  isAuthenticated: boolean
  setUserName: (name: string) => void
  language: 'id' | 'en'
  setLanguage: (lang: 'id' | 'en') => void
  activePartId: string | null
  activeLessonNum: string | null
  openLesson: (partId: string, lessonNum: string) => void
  closeLesson: () => void
  completedLessons: Set<string>
  toggleCompleted: (lessonNum: string) => void
  subscriptionTier: SubscriptionTier
  setSubscriptionTier: (tier: SubscriptionTier, name: string) => void
  unsubscribe: () => void
  /** Seluruh konten gratis — selalu true */
  hasCurriculumAccess: () => boolean
  /** Seluruh konten gratis — selalu true */
  hasCommunityAccess: () => boolean
  // Freemium lesson state
  freeLessonNum: string | null
  openFreeLesson: (lessonNum: string) => void
  closeFreeLesson: () => void
  // Locked lesson modal (no-op, all content free)
  lockedLesson: { num: string; title: string; bullets: string[]; partColor: string; partTitle: string } | null
  openLockedLesson: (info: { num: string; title: string; bullets: string[]; partColor: string; partTitle: string }) => void
  closeLockedLesson: () => void

  // Authentication
  login: (email: string, password: string) => Promise<boolean>
  registerUser: (name: string, email: string, password: string) => Promise<boolean>
  logoutUser: () => Promise<void>
  checkSession: () => Promise<void>

  // Lead registration (email + phone capture)
  leadRegistered: boolean
  leadData: LeadData | null
  registerLead: (data: LeadData) => void
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

function persistState(state: {
  userName: string
  userEmail: string
  isAuthenticated: boolean
  completedLessons: string[]
  language?: 'id' | 'en'
  leadRegistered?: boolean
  leadData?: { name: string; email: string; phone: string } | null
}) {
  if (typeof window === 'undefined') return
  try {
    const existing = localStorage.getItem('nv-app-state')
    const parsed = existing ? JSON.parse(existing) : {}
    const finalState = {
      ...parsed,
      ...state,
      language: state.language || parsed.language || 'id'
    }
    localStorage.setItem('nv-app-state', JSON.stringify(finalState))
  } catch {
    // localStorage might be full or blocked
  }
}

// Get simulated users database from localStorage
function getSimulatedUsers(): Record<string, SimulatedUser> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem('nv-users-db')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// Save simulated users database to localStorage
function saveSimulatedUsers(users: Record<string, SimulatedUser>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('nv-users-db', JSON.stringify(users))
  } catch {}
}

// Initialize from persisted state
const persisted = typeof window !== 'undefined' ? loadPersistedState() : null

export const useAppStore = create<AppState>((set, get) => ({
  view: 'landing',
  setView: (view) => set({ view }),
  userName: persisted?.userName || '',
  userEmail: persisted?.userEmail || '',
  isAuthenticated: persisted?.isAuthenticated || false,
  language: persisted?.language || 'id',
  setLanguage: (language) => {
    set({ language })
    persistState({
      userName: get().userName,
      userEmail: get().userEmail,
      isAuthenticated: get().isAuthenticated,
      completedLessons: [...get().completedLessons],
      language
    })
  },
  setUserName: (name) => {
    set({ userName: name })
    persistState({
      userName: name,
      userEmail: get().userEmail,
      isAuthenticated: get().isAuthenticated,
      completedLessons: [...get().completedLessons]
    })
  },
  activePartId: null,
  activeLessonNum: null,
  openLesson: (partId, lessonNum) =>
    set({ activePartId: partId, activeLessonNum: lessonNum, view: 'lesson' }),
  closeLesson: () =>
    set({ activePartId: null, activeLessonNum: null, view: 'landing' }),
  completedLessons: new Set<string>(persisted?.completedLessons || []),
  toggleCompleted: (lessonNum) =>
    set((state) => {
      const next = new Set(state.completedLessons)
      if (next.has(lessonNum)) {
        next.delete(lessonNum)
      } else {
        next.add(lessonNum)
      }

      // Update in simulated user DB
      if (state.isAuthenticated && state.userEmail) {
        const users = getSimulatedUsers()
        if (users[state.userEmail]) {
          users[state.userEmail].completedLessons = [...next]
          saveSimulatedUsers(users)
        }
      }

      persistState({
        userName: state.userName,
        userEmail: state.userEmail,
        isAuthenticated: state.isAuthenticated,
        completedLessons: [...next]
      })
      return { completedLessons: next }
    }),
  subscriptionTier: 'free',
  setSubscriptionTier: (_tier: SubscriptionTier, name: string) => {
    const email = get().userEmail || `${name.toLowerCase().replace(/\s+/g, '')}@simulated.com`
    set({
      subscriptionTier: 'free',
      userName: name,
      userEmail: email,
      isAuthenticated: true,
      view: 'dashboard'
    })

    persistState({
      userName: name,
      userEmail: email,
      isAuthenticated: true,
      completedLessons: [...get().completedLessons]
    })
  },
  unsubscribe: () => {
    set({
      userName: '',
      userEmail: '',
      isAuthenticated: false,
      view: 'landing',
      completedLessons: new Set<string>(),
    })
    persistState({
      userName: '',
      userEmail: '',
      isAuthenticated: false,
      completedLessons: []
    })
  },
  /** Seluruh konten gratis */
  hasCurriculumAccess: () => true,
  /** Seluruh konten gratis */
  hasCommunityAccess: () => true,
  // Freemium lesson state
  freeLessonNum: null,
  openFreeLesson: (lessonNum) =>
    set({ freeLessonNum: lessonNum, view: 'free-lesson' }),
  closeFreeLesson: () =>
    set({ freeLessonNum: null, view: 'landing' }),
  // Locked lesson modal
  lockedLesson: null,
  openLockedLesson: (_info) =>
    null, // Semua konten gratis — no-op
  closeLockedLesson: () =>
    null, // Semua konten gratis — no-op

  leadRegistered: persisted?.leadRegistered || false,
  leadData: persisted?.leadData || null,
  registerLead: (data) => {
    set({ leadRegistered: true, leadData: data })
    persistState({
      userName: get().userName,
      userEmail: get().userEmail,
      isAuthenticated: get().isAuthenticated,
      completedLessons: [...get().completedLessons],
      leadRegistered: true,
      leadData: data
    })
  },

  // Authentication
  login: async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        const completions = new Set<string>(data.user.completedLessons || [])
        set({
          userName: data.user.name,
          userEmail: data.user.email,
          isAuthenticated: true,
          completedLessons: completions,
          view: 'dashboard'
        })
        persistState({
          userName: data.user.name,
          userEmail: data.user.email,
          isAuthenticated: true,
          completedLessons: [...completions]
        })
        return true
      }
    } catch (error) {
      console.error('Login error:', error)
    }
    return false
  },
  registerUser: async (name, email, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        set({
          userName: data.user.name,
          userEmail: data.user.email,
          isAuthenticated: true,
          completedLessons: new Set<string>(),
          view: 'dashboard'
        })
        persistState({
          userName: data.user.name,
          userEmail: data.user.email,
          isAuthenticated: true,
          completedLessons: []
        })
        return true
      }
    } catch (error) {
      console.error('Registration error:', error)
    }
    return false
  },
  logoutUser: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {
      console.error('Logout API error:', e)
    }
    get().unsubscribe()
  },
  checkSession: async () => {
    try {
      const res = await fetch('/api/auth/check')
      if (res.ok) {
        const data = await res.json()
        if (data.authenticated) {
          // Sync completion list
          const completedSet = new Set<string>(data.user.completedLessons || [])
          set({
            userName: data.user.name,
            userEmail: data.user.email,
            isAuthenticated: true,
            completedLessons: completedSet
          })

          persistState({
            userName: data.user.name,
            userEmail: data.user.email,
            isAuthenticated: true,
            completedLessons: [...completedSet]
          })
        }
      }
    } catch (e) {
      console.error('Error checking session:', e)
    }
  }
}))
