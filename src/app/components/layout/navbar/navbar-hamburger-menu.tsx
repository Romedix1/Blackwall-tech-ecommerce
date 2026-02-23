'use client'

import { MobileMenu } from '@/app/components/layout/navbar/navbar-mobile-menu'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export const NavbarHamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const colorStyle =
    'bg-text-main group-focus:bg-background group-hover:bg-background'

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="group terminal-hover flex h-7 w-7 flex-col items-center justify-center"
      >
        <div
          className={cn(
            `h-0.5 w-6 transition-transform duration-300 ease-in-out`,
            isOpen ? 'translate-y-2 rotate-45' : '',
            colorStyle,
          )}
        />

        <div
          className={cn(
            'my-1.5 h-0.5 w-6 transition-opacity duration-200',
            isOpen ? 'opacity-0' : 'opacity-100',
            colorStyle,
          )}
        />

        <div
          className={cn(
            `ease-in-ou h-0.5 w-6 transition-transform duration-300`,
            isOpen ? '-translate-y-2 -rotate-45' : '',
            colorStyle,
          )}
        />
      </button>

      {isOpen && <MobileMenu />}
    </>
  )
}
