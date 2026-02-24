'use client'

import { MobileMenu } from '@/components/layout/navbar'
import { useMobileMenu } from '@/hooks/use-mobile-menu'

export const MobileMenuShell = () => {
  const { isOpen } = useMobileMenu()
  if (!isOpen) return null

  return <MobileMenu />
}
