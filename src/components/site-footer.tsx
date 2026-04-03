'use client'

import { useState, useEffect } from 'react'
import { Building2 } from 'lucide-react'

export function SiteFooter() {
  const [developerName, setDeveloperName] = useState<string>('Logistics Solutions')
  const [websiteLink, setWebsiteLink] = useState<string>('#')

  useEffect(() => {
    async function fetchDeveloperInfo() {
      try {
        const res = await fetch('/api/developer-info')
        const data = await res.json()
        if (data.developer_name) setDeveloperName(data.developer_name)
        if (data.website_link) setWebsiteLink(data.website_link)
      } catch {
        // Fallback to defaults already set
      }
    }
    fetchDeveloperInfo()
  }, [])

  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Copyright &copy; {currentYear} All Rights Reserved | Developed by</span>
            {websiteLink && websiteLink !== '#' ? (
              <a
                href={websiteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium transition-colors hover:underline"
              >
                <Building2 className="h-3.5 w-3.5" />
                {developerName}
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-medium text-gray-800">
                <Building2 className="h-3.5 w-3.5" />
                {developerName}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400">
            Powered by modern logistics technology
          </div>
        </div>
      </div>
    </footer>
  )
}
