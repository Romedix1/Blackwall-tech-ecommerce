'use client'

import { useCart } from '@/hooks'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { mergeCartWithDb, fetchCartFromDb } from '@/lib/actions/cart'

export const AuthWatcher = () => {
  const { status } = useSession()
  const { items, setCart } = useCart()
  const pathname = usePathname()

  const wasAuthenticated = useRef(false)
  const hasHandledSync = useRef(false)

  useEffect(() => {
    if (status === 'authenticated') {
      wasAuthenticated.current = true

      if (!hasHandledSync.current) {
        hasHandledSync.current = true

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
            console.error('[ CART_SYNC_ERROR ]', error)
          }
        }

        handleCartLogic()
      }
    }

    if (status === 'unauthenticated' && wasAuthenticated.current) {
      wasAuthenticated.current = false
      hasHandledSync.current = false

      if (pathname !== '/login') {
        setCart([])
        signOut({ callbackUrl: '/login?error=session-expired' })
      }
    }
  }, [status, pathname, setCart, items])

  return null
}
