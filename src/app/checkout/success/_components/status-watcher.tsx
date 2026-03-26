'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function StatusWatcher({ orderId }: { orderId: string }) {
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`)
        const data = await res.json()

        if (data.status === 'paid' || data.status === 'failed') {
          router.refresh()
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[STATUS_CHECK_ERROR]: ', error)
        }
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [orderId, router])

  return null
}
