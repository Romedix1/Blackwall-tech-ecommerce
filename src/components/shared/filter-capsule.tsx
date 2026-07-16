'use client'

import { cn } from '@/lib'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type FilterCapsuleProps = {
  filterKey: string
  option: string | number
  hideFilterKey?: boolean
}

export const FilterCapsule = ({
  filterKey,
  option,
  hideFilterKey = false,
}: FilterCapsuleProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const value = String(option)

  const activeValues = searchParams.getAll(filterKey)

  const isActive = activeValues.includes(value)

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (isActive) {
      params.delete(filterKey)

      activeValues
        .filter((v) => v !== value)
        .forEach((v) => params.append(filterKey, v))
    } else {
      params.append(filterKey, value)
    }

    params.delete('page')

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'terminal-hover cursor-pointer border px-3 py-2 text-sm whitespace-nowrap uppercase transition-colors outline-none',
        isActive && 'bg-accent text-secondary',
      )}
    >
      {hideFilterKey ? (
        <>
          <span className="font-bold">{option}</span>
        </>
      ) : (
        <>
          <span className="font-bold">{filterKey}:</span> <span>{option}</span>
        </>
      )}
    </button>
  )
}
