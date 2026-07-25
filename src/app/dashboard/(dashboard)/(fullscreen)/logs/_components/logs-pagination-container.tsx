import { prisma } from '@/lib/prisma'
import { PaginationButtons } from '@/app/dashboard/_components'
import { Prisma } from '../../../../../../../generated/prisma'

type LogsPaginationContainerProps = {
  searchValue?: string
  actionsArray?: string[]
}

export const LogsPaginationContainer = async ({
  searchValue,
  actionsArray,
}: LogsPaginationContainerProps) => {
  const ITEMS_PER_PAGE = 20
  const whereClause: Prisma.SystemLogWhereInput = {}

  if (searchValue) {
    whereClause.user = {
      username: { contains: searchValue, mode: 'insensitive' },
    }
  }

  if (actionsArray && actionsArray.length > 0) {
    whereClause.action = { in: actionsArray }
  }

  const totalLogs = await prisma.systemLog.count({ where: whereClause })
  const totalPages = Math.ceil(totalLogs / ITEMS_PER_PAGE)

  return <PaginationButtons maxPages={totalPages} />
}
