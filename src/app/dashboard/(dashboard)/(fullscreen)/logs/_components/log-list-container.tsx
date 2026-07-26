import { prisma } from '@/lib/prisma'
import { ViewLogs } from '@/app/dashboard/(dashboard)/(fullscreen)/logs/_components'
import { Prisma } from '../../../../../../../generated/prisma'

type LogsListContainerProps = {
  currentPage: number
  searchValue?: string
  actionsArray?: string[]
}

export const LogsListContainer = async ({
  currentPage,
  searchValue,
  actionsArray,
}: LogsListContainerProps) => {
  const ITEMS_PER_PAGE = 20
  const skipLogs = (currentPage - 1) * ITEMS_PER_PAGE

  const whereClause: Prisma.SystemLogWhereInput = {}

  if (searchValue) {
    whereClause.user = {
      username: { contains: searchValue, mode: 'insensitive' },
    }
  }
  if (actionsArray && actionsArray.length > 0) {
    whereClause.action = { in: actionsArray }
  }

  const logs = await prisma.systemLog.findMany({
    take: ITEMS_PER_PAGE,
    skip: skipLogs,
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      action: true,
      createdAt: true,
      details: true,
      user: { select: { username: true } },
    },
  })

  return (
    <ul className="mb-12 flex flex-col gap-4">
      {logs.map((log) => (
        <ViewLogs key={log.id} log={log} />
      ))}
    </ul>
  )
}
