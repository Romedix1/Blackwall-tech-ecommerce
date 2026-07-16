'use client'

import { BackButton } from '@/app/dashboard/(dashboard)/(fullscreen)/_components/back-button'
import { SearchInput } from '@/components/shared'
import { useDebounce } from '@/hooks'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export const LogSearch = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') || '',
  )
  const filterRef = useRef<HTMLInputElement>(null)

  const debouncedValue = useDebounce(searchValue, 600)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (debouncedValue.trim()) {
      params.set('search', debouncedValue)
    } else {
      params.delete('search')
    }

    params.delete('page')

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [debouncedValue, router, pathname])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault()
        filterRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="w-full">
      <div className="mb-8">
        <BackButton link="/dashboard" />
      </div>

      <SearchInput
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        containerClassName={'w-full xl:w-full'}
        placeholder={`search_by_user`}
        ref={filterRef}
        variant="filter"
        inputClassName="h-11.5"
        aria-label={`Search by user`}
      />
    </div>
  )
}
