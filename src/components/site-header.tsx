'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface Settings {
  site_name?: string
  company_phone?: string
}

export function SiteHeader() {
  const [settings, setSettings] = useState<Settings>({})
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        setSettings(data)
      } catch {
        // fallback
      }
    }
    fetchSettings()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Tracking', href: '/tracking' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-white shadow-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              {settings.site_name || 'Logistics Pro'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {settings.company_phone && (
              <a
                href={`tel:${settings.company_phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Phone className="h-4 w-4" />
                {settings.company_phone}
              </a>
            )}
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/contact">Get Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="flex items-center gap-2 mb-6">
                <Truck className="h-5 w-5 text-blue-600" />
                {settings.site_name || 'Logistics Pro'}
              </SheetTitle>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2.5 text-base font-medium text-gray-700 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 pt-6 border-t">
                {settings.company_phone && (
                  <a
                    href={`tel:${settings.company_phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4"
                  >
                    <Phone className="h-4 w-4" />
                    {settings.company_phone}
                  </a>
                )}
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/contact">Get Quote</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
