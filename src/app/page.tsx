'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, Truck, Shield, Clock, MapPin, Star, CheckCircle,
  Package, Phone, Users, BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ServiceCard } from '@/components/service-card'
import { TestimonialCarousel } from '@/components/testimonial-carousel'
import { WhatsAppButton } from '@/components/whatsapp-button'

interface Settings {
  site_name?: string
  company_phone?: string
  show_tracking_homepage?: string
  show_gallery_homepage?: string
}

export default function HomePage() {
  const [settings, setSettings] = useState<Settings>({})
  const [services, setServices] = useState<any[]>([])
  const [galleryImages, setGalleryImages] = useState<any[]>([])
  const [trackingNumber, setTrackingNumber] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, servicesRes, galleryRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/services'),
          fetch('/api/gallery'),
        ])
        const [settingsData, servicesData, galleryData] = await Promise.all([
          settingsRes.json(),
          servicesRes.json(),
          galleryRes.json(),
        ])
        setSettings(settingsData)
        setServices(Array.isArray(servicesData) ? servicesData : [])
        setGalleryImages(Array.isArray(galleryData) ? galleryData : [])
      } catch {
        // fallback
      }
    }
    fetchData()
  }, [])

  const handleTrackingSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingNumber.trim()) {
      window.location.href = `/tracking?number=${encodeURIComponent(trackingNumber.trim())}`
    }
  }

  const siteName = settings.site_name || 'Logistics Pro'

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Reliable Logistics <br />
              <span className="text-orange-400">Solutions</span> For Your Business
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-xl">
              We provide end-to-end logistics and transportation services with real-time tracking, 
              safe handling, and on-time delivery across India.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8">
                <Link href="/contact">
                  Get Free Quote <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                <Link href="/services">Our Services</Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { icon: Package, value: '10K+', label: 'Deliveries' },
              { icon: Users, value: '5K+', label: 'Happy Clients' },
              { icon: MapPin, value: '500+', label: 'Cities' },
              { icon: Star, value: '4.8', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-orange-400" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-blue-200">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a comprehensive range of logistics and transportation services to meet all your needs.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
          {services.length > 6 && (
            <div className="text-center mt-10">
              <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Link href="/services">View All Services <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting started with our logistics services is simple and hassle-free.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Get Quote', desc: 'Fill out our simple form or call us for a free quote.', icon: Phone },
              { step: '02', title: 'Book Service', desc: 'Choose your preferred service and schedule a pickup.', icon: CheckCircle },
              { step: '03', title: 'We Pickup', desc: 'Our team arrives at your location for safe packing.', icon: Package },
              { step: '04', title: 'Delivered', desc: 'Track your shipment in real-time until delivery.', icon: Truck },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="relative inline-flex mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <item.icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
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
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Insured & Safe', desc: 'All shipments are fully insured for complete peace of mind.' },
              { icon: Clock, title: 'On-Time Delivery', desc: 'We guarantee timely delivery with our efficient logistics network.' },
              { icon: BarChart3, title: 'Real-Time Tracking', desc: 'Track your shipment live with our advanced tracking system.' },
              { icon: Users, title: 'Expert Team', desc: 'Trained professionals handle your goods with utmost care.' },
              { icon: MapPin, title: 'Pan India', desc: 'Serving 500+ cities across India with our vast network.' },
              { icon: Truck, title: 'All Vehicle Types', desc: 'From bikes to trucks, we have the right vehicle for every need.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <item.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracking Section */}
      {settings.show_tracking_homepage !== 'false' && (
        <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Track Your Shipment</h2>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                Enter your tracking number to get real-time updates on your shipment.
              </p>
              <form onSubmit={handleTrackingSearch} className="max-w-lg mx-auto flex gap-3">
                <Input
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 h-12"
                />
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-6 shrink-0">
                  Track Now
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
          </motion.div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Gallery Preview */}
      {settings.show_gallery_homepage !== 'false' && galleryImages.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Work
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Browse through some of our successful logistics operations.
              </p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.slice(0, 8).map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                >
                  {img.image && (
                    <Image
                      src={img.image}
                      alt={img.title || 'Gallery'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button asChild variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Link href="/gallery">View Gallery <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 md:p-16 text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Move? Let&apos;s Get Started!
            </h2>
            <p className="text-orange-100 mb-8 max-w-xl mx-auto">
              Contact us today for a free quote. We&apos;ll handle everything from packing to delivery.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8">
                <Link href="/contact">Get Free Quote</Link>
              </Button>
              {settings.company_phone && (
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                  <a href={`tel:${settings.company_phone.replace(/\s/g, '')}`}>
                    <Phone className="mr-2 h-5 w-5" /> Call Us
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  )
}
