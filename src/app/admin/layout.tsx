'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Truck, Users, BarChart3, Image, Star,
  Settings as SettingsIcon, Link2, Share2, LogOut, Menu, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Services', href: '/admin/services', icon: Truck },
  { label: 'Leads', href: '/admin/leads', icon: Users },
  { label: 'Tracking', href: '/admin/tracking', icon: BarChart3 },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
  { label: 'Gallery', href: '/admin/gallery', icon: Image },
  { label: 'Settings', href: '/admin/settings', icon: SettingsIcon },
  { label: 'Social Media', href: '/admin/social-media', icon: Share2 },
  { label: 'Footer Links', href: '/admin/footer-links', icon: Link2 },
]

function subscribeToAuth(callback: () => void) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

function getAuthSnapshot() {
  try {
    const stored = localStorage.getItem('adminAuth')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function getServerAuthSnapshot() {
  return null
}

function useAuth() {
  return useSyncExternalStore(subscribeToAuth, getAuthSnapshot, getServerAuthSnapshot)
}

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const auth = useAuth()
  const mounted = useIsMounted()

  useEffect(() => {
    if (!mounted) return
    if (!auth) {
      router.push('/admin/login')
    }
  }, [mounted, auth, router])

  if (!mounted || !auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    toast.success('Logged out successfully')
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg lg:shadow-none transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Truck className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">Admin Panel</span>
            </Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Nav Links */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* User Info */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">
                  {auth.name?.charAt(0) || auth.email?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{auth.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 truncate">{auth.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-gray-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
              View Site
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
