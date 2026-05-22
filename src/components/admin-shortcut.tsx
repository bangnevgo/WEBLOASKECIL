'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'

export default function AdminShortcut() {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        console.log('Admin shortcut triggered!')
        const currentState = useAppStore.getState()
        const newState = !currentState.isAdmin
        console.log('Current admin state:', currentState.isAdmin, 'New state:', newState)
        useAppStore.setAdmin(newState)
        toast.success(newState ? 'Admin mode enabled' : 'Admin mode disabled')
        setTimeout(() => location.reload(), 1000)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return null
}