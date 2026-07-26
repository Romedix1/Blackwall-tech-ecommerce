import { Button } from '@/components/ui'

export const PaginationButtonsSkeleton = () => {
  return (
    <div className="flex gap-8 lg:gap-12 xl:gap-24">
      <Button disabled className="skeleton-loading">
        <span className="sr-only">Pagination loading</span>
        <span aria-hidden="true" className="opacity-0">
          [ prev ]
        </span>
      </Button>

      <Button disabled className="skeleton-loading">
        <span className="sr-only">Pagination loading</span>
        <span aria-hidden="true" className="opacity-0">
          [ next ]
        </span>
      </Button>
    </div>
  )
}
