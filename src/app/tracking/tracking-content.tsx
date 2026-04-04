'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { TrackingTimeline } from '@/components/tracking-timeline'

export function TrackingPageContent() {
  const searchParams = useSearchParams()
  const initialNumber = searchParams.get('number') || ''
  const [trackingNumber, setTrackingNumber] = useState(initialNumber)
  const [trackingData, setTrackingData] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialNumber) {
      handleSearch(initialNumber)
    }
  }, [])

  const handleSearch = async (number?: string) => {
    const num = number || trackingNumber
    if (!num.trim()) return

    setLoading(true)
    setError('')
    setTrackingData(null)

    try {
      const res = await fetch(`/api/tracking?number=${encodeURIComponent(num.trim())}`)
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Tracking number not found')
        return
      }
      const data = await res.json()
      setTrackingData(data)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Track Your Shipment</h1>
            <p className="text-blue-100 max-w-xl mx-auto text-lg">
              Enter your tracking number to get real-time status updates on your shipment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="py-12">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 -mt-12 relative z-10">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSearch()
              }}
              className="flex gap-3"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Enter tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 h-12 px-6"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  'Track'
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto px-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">{error}</p>
              <p className="text-sm text-gray-400 mt-2">Please check your tracking number and try again.</p>
            </motion.div>
          )}

          {trackingData && <TrackingTimeline tracking={trackingData} />}
        </div>
      </section>
    </div>
  )
}
