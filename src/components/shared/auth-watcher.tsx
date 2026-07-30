'use client'

import { useCart } from '@/hooks'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { mergeCartWithDb, fetchCartFromDb } from '@/lib/actions/cart'

export const AuthWatcher = () => {
  const { status } = useSession()
  const { items, setCart, hasHydrated } = useCart()
  const pathname = usePathname()

  const wasAuthenticated = useRef(false)

  useEffect(() => {
    if (status === 'authenticated' && hasHydrated) {
      wasAuthenticated.current = true

      const hasHandledSync = sessionStorage.getItem('cart_synced')

      if (!hasHandledSync) {
        sessionStorage.setItem('cart_synced', 'true')

        const handleCartLogic = async () => {
          try {
            if (items.length > 0) {
              const localCartData = items.map((item) => ({
                slug: item.slug,
                quantity: item.quantity,
              }))

              const result = await mergeCartWithDb(localCartData)

              if (result.success && result.cart) {
                setCart(result.cart)
              }
            } else {
              const dbCart = await fetchCartFromDb()

              if (dbCart) {
                setCart(dbCart)
              }
            }
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('[ CART_SYNC_ERROR ]', error)
            }
            sessionStorage.removeItem('cart_synced')
          }
        }

        handleCartLogic()
      }
    }

    if (status === 'unauthenticated') {
      sessionStorage.removeItem('cart_synced')

      if (wasAuthenticated.current) {
        wasAuthenticated.current = false

        if (pathname !== '/login') {
          setCart([])
          signOut({ callbackUrl: '/login?error=session-expired' })
        }
      }
    }
  }, [status, pathname, setCart, items, hasHydrated])

  return null
}
