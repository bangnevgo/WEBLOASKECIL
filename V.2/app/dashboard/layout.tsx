'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, Home, BookOpen, Users, MessageSquare, Calendar, Settings, LogOut } from 'lucide-react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Beranda', icon: Home },
    { href: '/dashboard/courses', label: 'Kursus', icon: BookOpen },
    { href: '/dashboard/forum', label: 'Forum', icon: MessageSquare },
    { href: '/dashboard/classes', label: 'Kelas Langsung', icon: Calendar },
    { href: '/dashboard/profile', label: 'Profil', icon: Settings },
  ]

  return (
    <div 
      className="relative min-h-screen"
      style={{
        backgroundImage: 'url(/images/dashboard-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-background/80 via-background/85 to-background/90 pointer-events-none"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-16 flex items-center justify-between px-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">HA</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-muted rounded-lg"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-sidebar/80 backdrop-blur-lg border-r border-sidebar-border/40 pt-20 md:pt-0 transform md:transform-none transition-transform duration-200 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="hidden md:flex md:items-center md:h-16 md:px-6 md:border-b md:border-sidebar-border">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">HA</span>
          </div>
          <span className="font-bold text-lg text-sidebar-foreground">Hukum Asumsi</span>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border space-y-3">
          <Link href="/api/auth/logout">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-0 mt-16 md:mt-0 md:flex-1">
        <div className="min-h-screen">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      </div>
    </div>
  )
}
