'use client'

import { Button } from '@/components/ui'
import { useEffect, useState } from 'react'

export function CookieModal() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasAccepted = localStorage.getItem('blackwall_cookie')

    if (!hasAccepted) {
      const timer = setTimeout(() => setIsVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('blackwall_cookie', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="bg-surface fixed bottom-4 left-1/2 z-100 w-full max-w-md -translate-x-1/2 border p-6 sm:right-8 sm:bottom-8 sm:left-auto sm:translate-x-0">
      <div className="mb-4 flex items-center gap-2 border-b pb-2">
        <span className="bg-error-text h-2 w-2 animate-pulse rounded-full"></span>
        <h2 className="text-sm font-bold tracking-wider uppercase">
          <span className="sr-only">System Directive</span>
          <span aria-hidden="true">[ System Directive ]</span>
        </h2>
      </div>

      <p className="text-text-second mb-6 text-xs leading-relaxed">
        This terminal requires local storage allocation for secure
        authentication and UI preferences. No third-party surveillance scripts
        are active
      </p>

      <Button onClick={handleAccept}>
        <span className="sr-only">Initialize</span>
        <span aria-hidden="true">[ Initialize ]</span>
      </Button>
    </div>
  )
}
