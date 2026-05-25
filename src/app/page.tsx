'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import Landing from '@/components/landing'
import Dashboard from '@/components/dashboard'
import LessonDetail from '@/components/lesson-detail'
import FreeLessonPage from '@/components/free-lesson-page'
import Pricing from '@/components/pricing'
import AiManifestation from '@/components/ai-manifestation'
import AiLimitingBelief from '@/components/ai-limiting-belief'
import AiShadow from '@/components/ai-shadow'
import AiPrivateSession from '@/components/ai-private-session'
import AdminPanel from '@/components/admin-panel'
import LoginView from '@/components/auth/login'
import RegisterView from '@/components/auth/register'
import CommunityPage from '@/components/community/CommunityPage'

export default function Home() {
  const { view } = useAppStore()

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [view])

  // Always use dark mode for this site
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <>
      {(() => {
        switch (view) {
          case 'landing':
            return <Landing />
          case 'dashboard':
            return <Dashboard />
          case 'lesson':
            return <LessonDetail />
          case 'free-lesson':
            return <FreeLessonPage />
          case 'pricing':
            return <Pricing />
          case 'ai-manifestation':
            return <AiManifestation />
          case 'ai-limiting-belief':
            return <AiLimitingBelief />
          case 'ai-shadow':
            return <AiShadow />
          case 'ai-private-session':
            return <AiPrivateSession />
          case 'admin':
            return <AdminPanel />
          case 'login':
            return <LoginView />
          case 'register':
            return <RegisterView />
          case 'community':
            return <CommunityPage />
          default:
            return <Landing />
        }
      })()}
    </>
  )
}
