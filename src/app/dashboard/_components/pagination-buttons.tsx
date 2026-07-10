'use client'

import { Button } from '@/components/ui'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

type PaginationButtonsProps = {
  maxPages: number
}

export const PaginationButtons = ({ maxPages }: PaginationButtonsProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentPage = Number(searchParams.get('page')) || 1

  const [isPending, startTransition] = useTransition()

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', pageNumber.toString())

    return `${pathname}?${params.toString()}`
  }

  const changePage = (newPage: number) => {
    startTransition(() => {
      router.push(createPageUrl(newPage))
    })
  }

  return (
    <div className="flex gap-8 lg:gap-12 xl:gap-24">
      <Button
        variant="secondary"
        disabled={currentPage === 1 || isPending}
        onClick={() => changePage(currentPage - 1)}
      >
        <span className="sr-only">Previous page</span>
        <span aria-hidden="true">[ prev ]</span>
      </Button>
      <Button
        disabled={currentPage === maxPages || isPending}
        onClick={() => changePage(currentPage + 1)}
      >
        <span className="sr-only">Next page</span>
        <span aria-hidden="true">[ next ]</span>
      </Button>
    </div>
  )
}
