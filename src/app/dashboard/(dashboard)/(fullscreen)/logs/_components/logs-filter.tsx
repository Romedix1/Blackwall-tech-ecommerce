'use client'

import { FilterCapsule } from '@/components/shared'
import { Button } from '@/components/ui'
import { cn } from '@/lib'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

type LogFilterProps = {
  actions: string[]
}

export const LogFilter = ({ actions }: LogFilterProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const [isMobileOverlayOpen, setIsMobileOverlayOpen] = useState(false)

  const handleReset = () => {
    router.push(pathname, { scroll: false })
  }

  // TODO: CHECK TEXT-PRIMARY-ACTIVE?

  return (
    <div className="mt-6 md:flex md:gap-6 lg:flex-col">
      <div className="lg:flex lg:flex-row-reverse">
        <div className="hidden flex-col gap-3 overflow-x-auto lg:flex">
          {actions.map((action, index) => {
            return (
              <FilterCapsule
                key={`filter-${index}`}
                filterKey="action"
                option={action}
                hideFilterKey={true}
              />
            )
          })}
        </div>
      </div>

      <Button
        onClick={() => setIsMobileOverlayOpen((prev) => !prev)}
        className="text-accent mt-6 h-fit w-full px-4 py-3 text-xs uppercase sm:px-6 sm:text-sm md:mt-0 md:w-3/12 lg:hidden"
        variant="secondary"
      >
        <span aria-hidden="true">[</span>
        <span>{!isMobileOverlayOpen ? '+' : '-'}</span>
        <span aria-hidden="true">]</span>
        <span className="ml-2">Filters</span>
      </Button>

      <div
        className={cn(
          'flex-col gap-8 lg:flex',
          isMobileOverlayOpen
            ? 'bg-background fixed top-70 bottom-0 left-0 z-40 flex w-screen overflow-y-auto border-t-4 px-6 pt-6 pb-16 lg:hidden'
            : 'hidden',
        )}
      >
        <div className="flex justify-end lg:hidden">
          <button
            onClick={() => setIsMobileOverlayOpen(false)}
            className="terminal-hover w-fit text-right uppercase"
          >
            <span aria-hidden="true">[</span>
            <span>x</span>
            <span aria-hidden="true">]</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col flex-nowrap gap-3 md:flex-row md:flex-wrap">
            {actions.map((action, index) => {
              return (
                <FilterCapsule
                  key={`filter-${index}`}
                  filterKey="action"
                  option={action}
                  hideFilterKey={true}
                />
              )
            })}
          </div>

          <button
            onClick={() => handleReset()}
            className="text-text-second hover:text-accent focus:text-accent mt-6 block cursor-pointer text-left text-sm uppercase"
          >
            <span aria-hidden="true">[ Reset_all_filters ]</span>
            <span className="sr-only">Reset all filters</span>
          </button>
        </div>
      </div>
    </div>
  )
}
