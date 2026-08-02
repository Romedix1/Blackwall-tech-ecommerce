import { prisma } from '@/lib/prisma'
import { Prisma } from '../../../../../generated/prisma'
import { InventoryProduct } from '@/app/dashboard/_components/admin/inventory'
import { DirectiveItem } from '@/app/dashboard/_components/admin/directives/directive-item'
import { OperativeItem } from '@/app/dashboard/_components/admin/operatives/operative-item'
import { auth } from '@/auth'
import {
  mockedOrdersList,
  mockedUsersList,
} from '@/app/dashboard/_components/admin/records-mocks'

type RecordsContainerProps = {
  mode: 'inventory' | 'directives' | 'operatives'
  page: number
  order?: 'asc' | 'desc'
  filter?: string
  searchValue?: string
}

export const RecordsContainer = async ({
  mode,
  page,
  order,
  filter,
  searchValue,
}: RecordsContainerProps) => {
  const user = await auth()
  const userRole = user?.user.role

  const ITEMS_PER_PAGE = 5
  const skipItems = (page - 1) * ITEMS_PER_PAGE
  const safeOrder = order === 'asc' ? 'asc' : 'desc'

  if (mode === 'inventory') {
    const allowedFilters = ['id', 'name', 'category', 'quantity', 'price']
    const safeFilter = allowedFilters.includes(filter as string) ? filter : 'id'

    let orderByClause: Prisma.ProductOrderByWithRelationInput = {}
    if (safeFilter === 'category') {
      orderByClause = { category: { slug: safeOrder } }
    } else {
      orderByClause = { [safeFilter as string]: safeOrder }
    }

    const productWhereClause: Prisma.ProductWhereInput = searchValue
      ? {
          OR: [
            { id: { contains: searchValue, mode: 'insensitive' } },
            { name: { contains: searchValue, mode: 'insensitive' } },
          ],
        }
      : {}

    const products = await prisma.product.findMany({
      take: ITEMS_PER_PAGE,
      skip: skipItems,
      where: productWhereClause,
      select: {
        id: true,
        name: true,
        category: { select: { slug: true } },
        quantity: true,
        price: true,
      },
      orderBy: orderByClause,
    })

    return (
      <>
        {products.map((product) => (
          <InventoryProduct key={product.id} product={product} />
        ))}
      </>
    )
  }

  if (mode === 'directives') {
    const allowedFilters = ['id', 'fullName', 'totalAmount', 'city', 'status']
    const safeFilter = allowedFilters.includes(filter as string) ? filter : 'id'

    const orderByClause: Prisma.OrderOrderByWithRelationInput = {
      [safeFilter as string]: safeOrder,
    }

    const orderWhereClause: Prisma.OrderWhereInput = searchValue
      ? {
          OR: [
            { id: { contains: searchValue, mode: 'insensitive' } },
            { city: { contains: searchValue, mode: 'insensitive' } },
          ],
        }
      : {}

    let orders = []

    if (userRole === 'admin') {
      orders = await prisma.order.findMany({
        take: ITEMS_PER_PAGE,
        skip: skipItems,
        where: orderWhereClause,
        select: {
          id: true,
          fullName: true,
          totalAmount: true,
          city: true,
          status: true,
        },
        orderBy: orderByClause,
      })
    } else {
      orders = mockedOrdersList.slice(skipItems, skipItems + ITEMS_PER_PAGE)
    }

    return (
      <>
        {orders.map((order) => (
          <DirectiveItem key={order.id} order={order} />
        ))}
      </>
    )
  }

  if (mode === 'operatives') {
    const allowedFilters = ['id', 'username', 'email', 'city']
    const safeFilter = allowedFilters.includes(filter as string) ? filter : 'id'

    const userByClause: Prisma.UserOrderByWithRelationInput = {
      [safeFilter as string]: safeOrder,
    }

    const userWhereClause: Prisma.UserWhereInput = searchValue
      ? {
          OR: [
            { id: { contains: searchValue, mode: 'insensitive' } },
            { username: { contains: searchValue, mode: 'insensitive' } },
          ],
        }
      : {}

    let users = null

    if (userRole === 'admin') {
      users = await prisma.user.findMany({
        take: ITEMS_PER_PAGE,
        skip: skipItems,
        where: userWhereClause,
        select: {
          id: true,
          username: true,
          email: true,
          city: true,
        },
        orderBy: userByClause,
      })
    } else {
      users = mockedUsersList.slice(skipItems, skipItems + ITEMS_PER_PAGE)
    }

    return (
      <>
        {users.map((user) => (
          <OperativeItem key={user.id} user={user} />
        ))}
      </>
    )
  }

  return null
}
