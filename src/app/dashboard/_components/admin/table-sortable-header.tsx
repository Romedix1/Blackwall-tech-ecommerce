'use client'

import { cn } from '@/lib'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ReactNode } from 'react'

type TableHeaderProps = {
  children: ReactNode
  filter: string
  className?: string
}

export const TableSortableHeader = ({
  children,
  filter,
  className,
}: TableHeaderProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const currentFilter = searchParams.get('filter')
  const order = searchParams.get('order')

  const sortProducts = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (currentFilter === filter) {
      params.set('order', order === 'asc' ? 'desc' : 'asc')
    } else {
      params.set('filter', filter)
      params.set('order', 'asc')
    }

    params.set('page', '1')

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <th
      onClick={sortProducts}
      className={cn('hover:text-accent cursor-pointer p-4', className)}
    >
      <span className="flex items-center gap-4">
        {children}
        {currentFilter === filter &&
          (order === 'asc' ? (
            <ChevronUp className="h-6 w-6" />
          ) : (
            <ChevronDown className="h-6 w-6" />
          ))}
      </span>
    </th>
  )
}
