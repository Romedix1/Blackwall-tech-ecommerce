import { prisma } from '@/lib/prisma'
import {
  LogFilterSidebar,
  LogFilterSidebarSkeleton,
  LogSearch,
  LogsListContainer,
  LogsListSkeleton,
  LogsPaginationContainer,
} from '@/app/dashboard/(dashboard)/(fullscreen)/logs/_components'
import { Suspense } from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { PaginationButtonsSkeleton } from '@/app/dashboard/_components'
import { mockedLogsList } from '@/app/dashboard/_components/admin'

type DashboardLogsProps = {
  searchParams: Promise<{
    page?: string
    search?: string
    action?: string | string[]
  }>
}

export default async function DashboardLogsPage({
  searchParams,
}: DashboardLogsProps) {
  const session = await auth()
  const user = session?.user

  if (!user || !['admin', 'demoAdmin'].includes(user.role)) {
    redirect('/')
    return
  }

  const isDemo = user?.role === 'demoAdmin'

  const resolvedParams = await searchParams

  const currentPage = Number(resolvedParams?.page) || 1
  const searchValue = resolvedParams.search
  const actionParams = resolvedParams.action

  const actionsArray = actionParams
    ? Array.isArray(actionParams)
      ? actionParams
      : [actionParams]
    : undefined

  let logFilters = null

  if (isDemo) {
    logFilters = mockedLogsList
  } else {
    logFilters = await prisma.systemLog.findMany({
      select: { action: true },
    })
  }

  const uniqueActions = [
    ...new Set<string>(logFilters.map((log) => log.action)),
  ]

  return (
    <div className="container mx-auto mt-6 flex flex-col md:grid md:grid-cols-12 md:items-start md:gap-x-4 lg:grid-cols-4 lg:grid-rows-[max-content_1fr]">
      <div className="order-1 md:col-span-9 lg:col-span-3 lg:col-start-2">
        <LogSearch />
      </div>

      <aside className="order-2 flex h-full flex-col justify-end md:col-span-3 lg:col-span-1 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:h-auto lg:max-h-200 lg:overflow-x-hidden lg:overflow-y-auto">
        <Suspense fallback={<LogFilterSidebarSkeleton />}>
          <LogFilterSidebar actions={uniqueActions} />
        </Suspense>
      </aside>

      <div className="order-3 mt-8 md:col-span-12 lg:col-span-3 lg:row-start-2">
        <Suspense fallback={<LogsListSkeleton />}>
          <LogsListContainer
            currentPage={currentPage}
            searchValue={searchValue}
            actionsArray={actionsArray}
          />
        </Suspense>

        <Suspense fallback={<PaginationButtonsSkeleton />}>
          <LogsPaginationContainer
            searchValue={searchValue}
            actionsArray={actionsArray}
          />
        </Suspense>
      </div>
    </div>
  )
}
