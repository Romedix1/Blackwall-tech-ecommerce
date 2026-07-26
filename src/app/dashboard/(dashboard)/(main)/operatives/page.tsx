import { DashboardHeader } from '@/app/dashboard/_components'
import {
  DashboardList,
  DashoardActionBar,
} from '@/app/dashboard/_components/admin'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

type DashboardOperativesProps = {
  searchParams: Promise<{
    page?: string
    filter?: string
    order?: 'asc' | 'desc'
    search?: string
  }>
}

export default async function DashboardOperativesPage({
  searchParams,
}: DashboardOperativesProps) {
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
        <span className="sr-only">Core database: Operative records</span>
        <span aria-hidden="true">{'//'} Core_database: Operative_records</span>
      </DashboardHeader>

      <div className="flex flex-col gap-8">
        <DashoardActionBar mode="operatives" />

        <DashboardList
          mode="operatives"
          page={currentPage}
          order={currentOrder}
          filter={currentFilter}
          searchValue={searchValue}
        />
      </div>
    </div>
  )
}
