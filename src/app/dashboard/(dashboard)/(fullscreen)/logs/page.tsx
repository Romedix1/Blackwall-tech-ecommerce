import { prisma } from '@/lib/prisma'
import { Prisma } from '../../../../../../generated/prisma'
import {
  LogFilterSidebar,
  LogSearch,
  ViewLogs,
} from '@/app/dashboard/(dashboard)/(fullscreen)/logs/_components'
import { PaginationButtons } from '@/app/dashboard/_components'

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
  const ITEMS_PER_PAGE = 20

  const resolvedParams = await searchParams

  const currentPage = Number(resolvedParams?.page) || 1

  const skipLogs = (currentPage - 1) * ITEMS_PER_PAGE

  const searchValue = resolvedParams.search
  const actionParams = resolvedParams.action

  const actionsArray = actionParams
    ? Array.isArray(actionParams)
      ? actionParams
      : [actionParams]
    : undefined

  const whereClause: Prisma.SystemLogWhereInput = {}

  if (searchValue) {
    whereClause.user = {
      username: {
        contains: searchValue,
        mode: 'insensitive',
      },
    }
  }

  if (actionsArray && actionsArray.length > 0) {
    whereClause.action = {
      in: actionsArray,
    }
  }

  const totalLogs = await prisma.systemLog.count({
    where: whereClause,
  })

  const logs = await prisma.systemLog.findMany({
    take: ITEMS_PER_PAGE,
    skip: skipLogs,
    where: whereClause,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      action: true,
      createdAt: true,
      details: true,
      user: {
        select: {
          username: true,
        },
      },
    },
  })

  const logFilters = await prisma.systemLog.findMany({
    select: {
      action: true,
    },
  })

  const uniqueActions = [
    ...new Set<string>(logFilters.map((log) => log.action)),
  ]

  const totalPages = Math.ceil(totalLogs / ITEMS_PER_PAGE)

  return (
    <div className="container mx-auto mt-6 flex flex-col md:grid md:grid-cols-12 md:items-start md:gap-x-4 lg:grid-cols-4 lg:grid-rows-[max-content_1fr]">
      <div className="order-1 md:col-span-9 lg:col-span-3 lg:col-start-2">
        <LogSearch />
      </div>

      <aside className="order-2 flex h-full flex-col justify-end md:col-span-3 lg:col-span-1 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:h-auto lg:max-h-200 lg:overflow-x-hidden lg:overflow-y-auto">
        <LogFilterSidebar actions={uniqueActions} />
      </aside>

      <div className="order-3 mt-8 md:col-span-12 lg:col-span-3 lg:row-start-2">
        <ul className="mb-12 flex flex-col gap-4">
          {logs.map((log) => {
            return <ViewLogs key={log.id} log={log} />
          })}
        </ul>

        <PaginationButtons maxPages={totalPages} />
      </div>
    </div>
  )
}
