'use client'

import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'

export function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState<string>('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        if (data.whatsapp_number) {
          setWhatsappNumber(data.whatsapp_number)
          setVisible(true)
        }
      } catch {
        // fallback
      }
    }
    fetchSettings()
  }, [])

  if (!visible || !whatsappNumber) return null

  const message = encodeURIComponent('Hi! I would like to inquire about your logistics services.')
  const url = `https://wa.me/${whatsappNumber}?text=${message}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}
