'use client'

import { SearchInput } from '@/components/shared'
import { Button } from '@/components/ui'
import { useDebounce } from '@/hooks'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export const InventoryActionBar = () => {
  const filterRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') || '',
  )

  const debouncedValue = useDebounce(searchValue, 600)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (debouncedValue.trim()) {
      params.set('search', debouncedValue)
    } else {
      params.delete('search')
    }

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
    <div className="flex flex-col items-center gap-4 lg:flex-row xl:justify-between">
      <SearchInput
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        containerClassName="w-full xl:w-9/12"
        placeholder="search_by_id_or_name"
        ref={filterRef}
        variant="filter"
        aria-label="Search by id or product name"
      />

      <Button
        asChild
        className="flex items-center justify-center lg:h-10 lg:w-6/12 lg:text-sm xl:w-4/12"
      >
        <Link href={'/inventory/add-product'}>
          <span aria-hidden="true">[ add_new_hardware ]</span>
          <span className="sr-only">Add new product</span>
        </Link>
      </Button>
    </div>
  )
}
