'use client'

import { useEffect, useCallback } from 'react'
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

export default function Home() {
  const { view, isAdmin, toggleAdmin } = useAppStore()

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [view])

  // Always use dark mode for this site
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  // Admin keyboard shortcut: Ctrl+Shift+A
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl+Shift+A (Windows/Linux) or Cmd+Shift+A (Mac)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
      e.preventDefault()
      toggleAdmin()
    }
  }, [toggleAdmin])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

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
          default:
            return <Landing />
        }
      })()}

      {/* Admin indicator — only visible when admin mode is active */}
      {isAdmin && (
        <div
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 9999,
            background: 'linear-gradient(135deg, rgba(212, 160, 83, 0.95), rgba(196, 136, 58, 0.95))',
            color: '#0a0a0c',
            padding: '8px 16px',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 800,
            fontFamily: 'var(--font-geist-mono), monospace',
            letterSpacing: 1,
            boxShadow: '0 4px 20px rgba(212, 160, 83, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
          onClick={toggleAdmin}
          title="Klik untuk matikan admin mode"
        >
          <span>🔓</span>
          <span>ADMIN MODE</span>
          <span style={{ opacity: 0.7, fontSize: 10 }}>⌘/Ctrl+Shift+A</span>
        </div>
      )}
    </>
  )
}
