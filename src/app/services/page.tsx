'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ServiceCard } from '@/components/service-card'

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services')
        const data = await res.json()
        setServices(Array.isArray(data) ? data : [])
      } catch {
        // fallback
      }
    }
    fetchServices()
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-blue-100 max-w-xl text-lg">
              Comprehensive logistics and transportation solutions tailored for your needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">No services available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
