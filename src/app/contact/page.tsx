'use client'

import { useState, useEffect } from 'react'
import { Phone, MapPin, Clock, Mail, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface Settings {
  company_phone?: string
  company_address?: string
  working_hours?: string
  whatsapp_number?: string
}

export default function ContactPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    moveFrom: '',
    moveTo: '',
    preferredDate: '',
    service: '',
    message: '',
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, servicesRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/services'),
        ])
        const [settingsData, servicesData] = await Promise.all([
          settingsRes.json(),
          servicesRes.json(),
        ])
        setSettings(settingsData)
        setServices(Array.isArray(servicesData) ? servicesData : [])
      } catch {
        // fallback
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      toast.error('Please fill in your name and phone number.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        toast.success('Thank you! We will get back to you soon.')
        setForm({ name: '', phone: '', moveFrom: '', moveTo: '', preferredDate: '', service: '', message: '' })
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-blue-100 max-w-xl text-lg">
              Get in touch with us for a free quote or any inquiry about our services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-8 relative z-10">
            {[
              {
                icon: Phone,
                title: 'Phone',
                detail: settings.company_phone || '+91 8340323153',
                href: `tel:${(settings.company_phone || '').replace(/\s/g, '')}`,
              },
              {
                icon: MapPin,
                title: 'Address',
                detail: settings.company_address || 'Ranchi, Buti More',
                href: '#',
              },
              {
                icon: Clock,
                title: 'Working Hours',
                detail: settings.working_hours || 'Mon - Sat: 9:00 AM - 10:00 PM',
                href: '#',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <a href={item.href}>
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <item.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.detail}</p>
                    </CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-lg">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Get a Free Quote</h2>
                <p className="text-gray-600 mb-6">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="Your phone number"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="moveFrom">Moving From</Label>
                      <Input
                        id="moveFrom"
                        placeholder="Pickup location"
                        value={form.moveFrom}
                        onChange={(e) => setForm({ ...form, moveFrom: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="moveTo">Moving To</Label>
                      <Input
                        id="moveTo"
                        placeholder="Destination"
                        value={form.moveTo}
                        onChange={(e) => setForm({ ...form, moveTo: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={form.preferredDate}
                        onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service">Service</Label>
                      <Select value={form.service} onValueChange={(val) => setForm({ ...form, service: val })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((s) => (
                            <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Additional details..."
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Send Inquiry
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
