'use client'

import { useState, useEffect } from 'react'
import { Shield, Clock, Users, MapPin, Star, Truck, Package, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'

interface Settings {
  company_address?: string
  company_phone?: string
  working_hours?: string
  site_name?: string
}

export default function AboutPage() {
  const [settings, setSettings] = useState<Settings>({})

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

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-blue-100 max-w-xl text-lg">
              Learn about our mission, values, and commitment to delivering excellence in logistics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Your Trusted Logistics Partner
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  {settings.site_name || 'Logistics Pro'} is a leading logistics and transportation company 
                  providing comprehensive moving and shipping solutions across India.
                </p>
                <p>
                  With years of experience in the industry, we have established ourselves as a trusted 
                  partner for individuals and businesses looking for reliable, efficient, and affordable 
                  logistics services.
                </p>
                <p>
                  Our team of trained professionals ensures that every shipment is handled with utmost 
                  care, from pickup to delivery. We use advanced tracking technology so you can monitor 
                  your goods in real-time throughout the journey.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Package, value: '10K+', label: 'Deliveries Completed' },
                { icon: Users, value: '5K+', label: 'Happy Customers' },
                { icon: MapPin, value: '500+', label: 'Cities Covered' },
                { icon: Star, value: '4.8', label: 'Average Rating' },
              ].map((stat) => (
                <Card key={stat.label} className="border-0 shadow-md text-center">
                  <CardContent className="p-6">
                    <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We go above and beyond to ensure your logistics experience is seamless and stress-free.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Fully Insured', desc: 'Complete insurance coverage for all shipments gives you peace of mind.' },
              { icon: Clock, title: 'On-Time Delivery', desc: 'We respect deadlines and deliver your goods on schedule, every time.' },
              { icon: Award, title: 'Quality Service', desc: 'Professional packing, handling, and transportation by trained experts.' },
              { icon: Truck, title: 'Live Tracking', desc: 'Real-time GPS tracking so you always know where your goods are.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-7 w-7 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Get In Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { icon: MapPin, label: 'Address', value: settings.company_address || 'Ranchi, Buti More' },
                { icon: Shield, label: 'Phone', value: settings.company_phone || '+91 8340323153' },
                { icon: Clock, label: 'Hours', value: settings.working_hours || 'Mon - Sat: 9:00 AM - 10:00 PM' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <item.icon className="h-5 w-5 text-orange-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-blue-200 text-sm">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
