import { TableHeader } from '@/app/dashboard/_components/admin/table-headers'
import { Suspense } from 'react'
import { ItemSkeleton } from '@/app/dashboard/_components/item-skeleton'
import { RecordsContainer } from '@/app/dashboard/_components/admin/records-container'
import { getTableFilters } from '@/app/dashboard/_components/admin/filters'
import { PaginationButtonsContainer } from '@/app/dashboard/_components/pagination-buttons-container'
import { PaginationButtonsSkeleton } from '@/app/dashboard/_components/pagination-buttons-skeleton'

type ProductListProps = {
  mode: 'inventory' | 'directives' | 'operatives'
  page: number
  order?: 'asc' | 'desc'
  filter?: string
  searchValue?: string
}

export const DashboardList = async ({
  mode,
  page,
  order,
  filter,
  searchValue,
}: ProductListProps) => {
  const filters = getTableFilters(mode)

  return (
    <div className="flex flex-col gap-8">
      <div className="relative h-110 w-full min-w-0 overflow-y-auto">
        <table className="w-225 table-fixed overflow-y-auto text-left 2xl:w-full">
          <thead className="text-text-second border-b">
            <TableHeader filters={filters} />
          </thead>
          <tbody>
            <Suspense fallback={<ItemSkeleton />}>
              <RecordsContainer
                mode={mode}
                page={page}
                order={order}
                filter={filter}
                searchValue={searchValue}
              />
            </Suspense>
          </tbody>
        </table>
      </div>

      <Suspense fallback={<PaginationButtonsSkeleton />}>
        <PaginationButtonsContainer mode={mode} searchValue={searchValue} />
      </Suspense>
    </div>
  )
}
