'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Building2, Phone, Mail, MapPin } from 'lucide-react'

interface FooterLink {
  id: string
  label: string
  href: string
  section: string | null
}

interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string | null
}

interface Settings {
  site_name?: string
  company_phone?: string
  company_address?: string
  working_hours?: string
}

export function SiteFooter() {
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [settings, setSettings] = useState<Settings>({})
  const [developerName, setDeveloperName] = useState<string>('')
  const [websiteLink, setWebsiteLink] = useState<string>('')

  useEffect(() => {
    async function fetchData() {
      try {
        const [linksRes, socialRes, settingsRes, devRes] = await Promise.all([
          fetch('/api/footer-links'),
          fetch('/api/social-media'),
          fetch('/api/settings'),
          fetch('/api/developer-info'),
        ])
        const [linksData, socialData, settingsData, devData] = await Promise.all([
          linksRes.json(),
          socialRes.json(),
          settingsRes.json(),
          devRes.json(),
        ])
        setFooterLinks(Array.isArray(linksData) ? linksData : [])
        setSocialLinks(Array.isArray(socialData) ? socialData : [])
        setSettings(settingsData)
        if (devData.developer_name) setDeveloperName(devData.developer_name)
        if (devData.website_link) setWebsiteLink(devData.website_link)
      } catch {
        // fallback
      }
    }
    fetchData()
  }, [])

  // Group footer links by section
  const sections: Record<string, FooterLink[]> = {}
  for (const link of footerLinks) {
    const section = link.section || 'Other'
    if (!sections[section]) sections[section] = []
    sections[section].push(link)
  }

  const currentYear = new Date().getFullYear()
  const siteName = settings.site_name || 'Logistics Pro'

  return (
    <footer className="w-full bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">{siteName}</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Providing reliable logistics and transportation services across India with real-time tracking and professional handling.
            </p>
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                    aria-label={s.platform}
                  >
                    <span className="text-xs font-bold">{s.platform.charAt(0)}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Footer Link Sections */}
          {Object.entries(sections).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-white font-semibold mb-4">{section}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              {settings.company_address && (
                <li className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 text-blue-400 shrink-0" />
                  <span>{settings.company_address}</span>
                </li>
              )}
              {settings.company_phone && (
                <li className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-blue-400 shrink-0" />
                  <a href={`tel:${settings.company_phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">
                    {settings.company_phone}
                  </a>
                </li>
              )}
              {settings.working_hours && (
                <li className="flex items-start gap-2 text-sm">
                  <Mail className="h-4 w-4 mt-0.5 text-blue-400 shrink-0" />
                  <span>{settings.working_hours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
            <p>Copyright &copy; {currentYear} {siteName}. All Rights Reserved.</p>
            <p className="flex items-center gap-1">
              Developed by{' '}
              {websiteLink && websiteLink !== '#' ? (
                <a
                  href={websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  <Building2 className="h-3 w-3" />
                  {developerName || 'Developer'}
                </a>
              ) : (
                <span className="inline-flex items-center gap-1 font-medium">
                  <Building2 className="h-3 w-3" />
                  {developerName || 'Developer'}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
