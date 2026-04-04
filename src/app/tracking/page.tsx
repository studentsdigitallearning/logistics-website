'use client'

import { Suspense } from 'react'
import { TrackingPageContent } from './tracking-content'

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    }>
      <TrackingPageContent />
    </Suspense>
  )
}
