'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([])
  const [selectedImage, setSelectedImage] = useState<any>(null)

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch('/api/gallery')
        const data = await res.json()
        setImages(Array.isArray(data) ? data : [])
      } catch {
        // fallback
      }
    }
    fetchGallery()
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Gallery</h1>
            <p className="text-blue-100 max-w-xl text-lg">
              Browse through our successful logistics operations and deliveries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                >
                  {img.image && (
                    <Image
                      src={img.image}
                      alt={img.title || 'Gallery'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  {img.title && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
                        {img.title}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">No gallery images available.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>
            {selectedImage.image && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-4xl max-h-[80vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedImage.image}
                  alt={selectedImage.title || 'Gallery'}
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-lg object-contain max-h-[80vh]"
                />
                {selectedImage.title && (
                  <p className="text-center text-white mt-4 font-medium">
                    {selectedImage.title}
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
