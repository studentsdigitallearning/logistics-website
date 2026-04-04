'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'

interface ServiceCardProps {
  service: {
    id: string
    title: string
    slug: string
    shortDesc: string | null
    image: string | null
  }
  index?: number
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/services/${service.slug}`}>
        <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="relative h-48 overflow-hidden bg-gray-100">
            {service.image ? (
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="text-4xl font-bold text-blue-300">
                  {service.title.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <CardContent className="p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {service.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {service.shortDesc || 'Professional logistics service tailored to your needs.'}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
              Learn More <ArrowRight className="h-4 w-4" />
            </span>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
