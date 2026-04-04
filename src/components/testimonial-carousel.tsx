'use client'

import { useState, useEffect, useCallback } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface Testimonial {
  id: string
  name: string
  role: string | null
  review: string
  rating: number | null
}

export function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch('/api/testimonials')
        const data = await res.json()
        if (Array.isArray(data)) setTestimonials(data)
      } catch {
        // fallback
      }
    }
    fetchTestimonials()
  }, [])

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection)
      setCurrent((prev) => {
        const next = prev + newDirection
        if (next < 0) return testimonials.length - 1
        if (next >= testimonials.length) return 0
        return next
      })
    },
    [testimonials.length]
  )

  useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = setInterval(() => paginate(1), 5000)
    return () => clearInterval(timer)
  }, [testimonials.length, paginate])

  if (testimonials.length === 0) return null

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  }

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 md:p-12">
        <Quote className="h-10 w-10 text-blue-200 mb-4" />
        <div className="relative min-h-[160px]">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <p className="text-lg md:text-xl text-gray-700 italic mb-6 leading-relaxed">
                &ldquo;{testimonials[current].review}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonials[current].name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonials[current].name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonials[current].role || 'Customer'}
                  </p>
                </div>
              </div>
              {testimonials[current].rating && (
                <div className="flex gap-1 mt-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < (testimonials[current].rating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {testimonials.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => paginate(-1)}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1)
                  setCurrent(i)
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === current ? 'bg-blue-600 w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => paginate(1)}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
