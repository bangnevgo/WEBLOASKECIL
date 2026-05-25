import { create } from 'zustand'

type View = 
  | 'landing' 
  | 'dashboard' 
  | 'lesson' 
  | 'pricing' 
  | 'free-lesson' 
  | 'ai-manifestation' 
  | 'ai-limiting-belief' 
  | 'ai-shadow' 
  | 'ai-private-session' 
  | 'admin' 
  | 'community'
  | 'login'
  | 'register'

export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'master'

interface SimulatedUser {
  name: string
  email: string
  passwordHash: string
  tier: SubscriptionTier
  completedLessons: string[]
}

interface AppState {
  view: View
  setView: (view: View) => void
  userName: string
  userEmail: string
  isAuthenticated: boolean
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
  
  // Simulated Authentication & Activation
  login: (email: string, password: string) => Promise<boolean>
  registerUser: (name: string, email: string, password: string) => Promise<boolean>
  logoutUser: () => Promise<void>
  redeemCode: (code: string) => Promise<{ success: boolean; tier?: SubscriptionTier; message: string }>
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
  subscriptionTier: SubscriptionTier
  isAdmin: boolean
  completedLessons: string[]
}) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('nv-app-state', JSON.stringify(state))
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
  setUserName: (name) => {
    set({ userName: name })
    persistState({
      userName: name,
      userEmail: get().userEmail,
      isAuthenticated: get().isAuthenticated,
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
        subscriptionTier: state.subscriptionTier,
        isAdmin: state.isAdmin,
        completedLessons: [...next]
      })
      return { completedLessons: next }
    }),
  subscriptionTier: (persisted?.subscriptionTier || 'free') as SubscriptionTier,
  setSubscriptionTier: (tier: SubscriptionTier, name: string) => {
    const email = get().userEmail || `${name.toLowerCase().replace(/\s+/g, '')}@simulated.com`
    set({ 
      subscriptionTier: tier, 
      userName: name, 
      userEmail: email,
      isAuthenticated: true,
      view: 'dashboard' 
    })
    
    // Save to simulated user database
    const users = getSimulatedUsers()
    if (users[email]) {
      users[email].tier = tier
      users[email].name = name
      saveSimulatedUsers(users)
    } else {
      users[email] = {
        name,
        email,
        passwordHash: 'simulated',
        tier,
        completedLessons: [...get().completedLessons]
      }
      saveSimulatedUsers(users)
    }

    persistState({
      userName: name,
      userEmail: email,
      isAuthenticated: true,
      subscriptionTier: tier,
      isAdmin: get().isAdmin,
      completedLessons: [...get().completedLessons]
    })
  },
  unsubscribe: () => {
    set({
      subscriptionTier: 'free',
      userName: '',
      userEmail: '',
      isAuthenticated: false,
      view: 'landing',
      completedLessons: new Set<string>(),
      isAdmin: false
    })
    persistState({
      userName: '',
      userEmail: '',
      isAuthenticated: false,
      subscriptionTier: 'free',
      isAdmin: false,
      completedLessons: []
    })
  },
  /** Check if user has full curriculum access (Basic tier or higher OR admin) */
  hasCurriculumAccess: () => {
    const state = get()
    if (state.isAdmin) return true
    return state.subscriptionTier === 'basic' || state.subscriptionTier === 'premium' || state.subscriptionTier === 'master'
  },
  /** Check if user has community access (Premium tier or higher OR admin) */
  hasCommunityAccess: () => {
    const state = get()
    if (state.isAdmin) return true
    return state.subscriptionTier === 'premium' || state.subscriptionTier === 'master'
  },
  // Admin mode
  isAdmin: persisted?.isAdmin || false,
  setAdmin: (admin) => {
    set({
      isAdmin: admin,
      subscriptionTier: admin ? 'master' : get().subscriptionTier
    })
    persistState({
      userName: get().userName,
      userEmail: get().userEmail,
      isAuthenticated: get().isAuthenticated,
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

  // Simulated Authentication & Activation
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
          subscriptionTier: data.user.tier,
          isAuthenticated: true,
          completedLessons: completions,
          view: 'dashboard'
        })
        persistState({
          userName: data.user.name,
          userEmail: data.user.email,
          isAuthenticated: true,
          subscriptionTier: data.user.tier,
          isAdmin: data.user.tier === 'master',
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
          subscriptionTier: 'free',
          isAuthenticated: true,
          completedLessons: new Set<string>(),
          view: 'dashboard'
        })
        persistState({
          userName: data.user.name,
          userEmail: data.user.email,
          isAuthenticated: true,
          subscriptionTier: 'free',
          isAdmin: false,
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
  redeemCode: async (code) => {
    const upperCode = code.trim().toUpperCase()
    try {
      const res = await fetch('/api/activation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: upperCode, userName: get().userName || 'Pengguna' })
      })
      const data = await res.json()
      
      if (res.ok && data.success) {
        const tier = data.tier as SubscriptionTier
        set({ subscriptionTier: tier })
        
        // Update simulated user database
        if (get().isAuthenticated && get().userEmail) {
          const users = getSimulatedUsers()
          if (users[get().userEmail]) {
            users[get().userEmail].tier = tier
            saveSimulatedUsers(users)
          }
        }
        
        persistState({
          userName: get().userName,
          userEmail: get().userEmail,
          isAuthenticated: get().isAuthenticated,
          subscriptionTier: tier,
          isAdmin: get().isAdmin,
          completedLessons: [...get().completedLessons]
        })
        
        return { success: true, tier, message: data.message || 'Aktivasi berhasil!' }
      } else {
        return { success: false, message: data.error || 'Kode aktivasi tidak valid atau telah kedaluwarsa.' }
      }
    } catch (error) {
      console.error('Activation API error:', error)
      return { success: false, message: 'Gagal terhubung ke server aktivasi.' }
    }
  }
}))
