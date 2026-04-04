'use client'

import { CheckCircle2, Circle, Truck, Package, MapPin, Clock, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface TrackingData {
  id: string
  trackingNumber: string
  customerName: string | null
  from_addr: string | null
  to_addr: string | null
  status: string
  dispatchDate: string | null
  deliveryDate: string | null
  currentLocation: string | null
}

const STEPS = [
  { key: 'Booked', label: 'Booked', icon: CheckCircle2, description: 'Shipment booked' },
  { key: 'Picked Up', label: 'Picked Up', icon: Package, description: 'Package picked up' },
  { key: 'In Transit', label: 'In Transit', icon: Truck, description: 'On the way' },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: MapPin, description: 'Out for delivery' },
  { key: 'Delivered', label: 'Delivered', icon: CheckCircle, description: 'Delivered' },
]

export function TrackingTimeline({ tracking }: { tracking: TrackingData }) {
  const currentStepIndex = STEPS.findIndex((s) => s.key === tracking.status)

  return (
    <div className="space-y-8">
      {/* Tracking Info */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-blue-100 text-sm">Tracking Number</p>
            <p className="text-xl font-bold">{tracking.trackingNumber}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Current Status</p>
            <p className="text-xl font-bold">{tracking.status}</p>
          </div>
          {tracking.customerName && (
            <div>
              <p className="text-blue-100 text-sm">Customer</p>
              <p className="font-semibold">{tracking.customerName}</p>
            </div>
          )}
          {tracking.currentLocation && (
            <div>
              <p className="text-blue-100 text-sm">Current Location</p>
              <p className="font-semibold">{tracking.currentLocation}</p>
            </div>
          )}
        </div>
      </div>

      {/* Route */}
      {(tracking.from_addr || tracking.to_addr) && (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full mx-auto" />
            <p className="text-sm font-medium text-gray-900 mt-1">From</p>
            <p className="text-sm text-gray-600">{tracking.from_addr || 'N/A'}</p>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-gray-300" />
          <div className="text-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto" />
            <p className="text-sm font-medium text-gray-900 mt-1">To</p>
            <p className="text-sm text-gray-600">{tracking.to_addr || 'N/A'}</p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex
            const isCurrent = index === currentStepIndex
            const Icon = step.icon

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="flex flex-col items-center relative z-10"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isCompleted
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-gray-100 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-blue-100 scale-110' : ''}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p
                  className={`text-xs font-semibold mt-2 text-center ${
                    isCompleted ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-gray-500 mt-1 text-center max-w-20"
                  >
                    {step.description}
                  </motion.p>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-0 mx-12">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${currentStepIndex >= 0 ? (currentStepIndex / (STEPS.length - 1)) * 100 : 0}%`,
            }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-full bg-blue-600"
          />
        </div>
      </div>

      {/* Dates */}
      {(tracking.dispatchDate || tracking.deliveryDate) && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {tracking.dispatchDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Dispatch: {new Date(tracking.dispatchDate).toLocaleDateString()}</span>
            </div>
          )}
          {tracking.deliveryDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Delivery: {new Date(tracking.deliveryDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
