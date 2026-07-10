import { DashboardHeader } from '@/app/dashboard/_components'
import {
  DashboardList,
  DashoardctionBar,
} from '@/app/dashboard/_components/admin'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

type ProductListProps = {
  searchParams: Promise<{
    page?: string
    filter?: string
    order?: 'asc' | 'desc'
    search?: string
  }>
}

export default async function DashboardDirectivesPage({
  searchParams,
}: ProductListProps) {
  const session = await auth()

  const resolvedParams = await searchParams

  const userRole = session?.user.role

  if (!userRole || userRole !== 'admin') {
    redirect('/')
  }

  const currentPage = Number(resolvedParams?.page) || 1
  const currentFilter = resolvedParams?.filter
  const currentOrder = resolvedParams?.order === 'asc' ? 'asc' : 'desc'
  const searchValue = resolvedParams?.search

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader>
        <span className="sr-only">Operational queue: Directive managment</span>
        <span aria-hidden="true">
          {'//'} Operational_queue: directive_management
        </span>
      </DashboardHeader>

      <div className="flex flex-col gap-8">
        <DashoardctionBar mode="directives" />

        <DashboardList
          mode="directives"
          page={currentPage}
          order={currentOrder}
          filter={currentFilter}
          searchValue={searchValue}
        />
      </div>
    </div>
  )
}
