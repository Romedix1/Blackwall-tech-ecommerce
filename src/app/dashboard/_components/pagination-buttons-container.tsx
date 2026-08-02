import { prisma } from '@/lib/prisma'
import { PaginationButtons } from '@/app/dashboard/_components/pagination-buttons'
import { Prisma } from '../../../../generated/prisma'
import { auth } from '@/auth'
import {
  mockedLogsList,
  mockedOrdersList,
  mockedUsersList,
} from '@/app/dashboard/_components/admin/records-mocks'

type PaginationContainerProps = {
  mode: 'inventory' | 'directives' | 'operatives'
  searchValue?: string
}

export const PaginationButtonsContainer = async ({
  mode,
  searchValue,
}: PaginationContainerProps) => {
  const session = await auth()
  const isDemo = session?.user?.role === 'demoAdmin'

  const ITEMS_PER_PAGE = 5
  let totalItems = 0

  if (isDemo) {
    if (mode === 'inventory') {
      totalItems = mockedLogsList.length
    } else if (mode === 'directives') {
      totalItems = mockedOrdersList.length
    } else if (mode === 'operatives') {
      totalItems = mockedUsersList.length
    } else if (mode === 'inventory') {
      const where: Prisma.ProductWhereInput = searchValue
        ? {
            OR: [
              { id: { contains: searchValue, mode: 'insensitive' } },
              { name: { contains: searchValue, mode: 'insensitive' } },
            ],
          }
        : {}
      totalItems = await prisma.product.count({ where })
    } else if (mode === 'directives') {
      const where: Prisma.OrderWhereInput = searchValue
        ? {
            OR: [
              { id: { contains: searchValue, mode: 'insensitive' } },
              { city: { contains: searchValue, mode: 'insensitive' } },
            ],
          }
        : {}
      totalItems = await prisma.order.count({ where })
    } else if (mode === 'operatives') {
      const where: Prisma.UserWhereInput = searchValue
        ? {
            OR: [
              { id: { contains: searchValue, mode: 'insensitive' } },
              { username: { contains: searchValue, mode: 'insensitive' } },
            ],
          }
        : {}
      totalItems = await prisma.user.count({ where })
    }
  }

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  return <PaginationButtons maxPages={totalPages} />
}
