import { InventoryProduct } from '@/app/dashboard/_components/admin/inventory'
import { prisma } from '@/lib/prisma'
import { Prisma } from '../../../../../generated/prisma'
import { TableHeader } from '@/app/dashboard/_components/admin/table-headers'
import { PaginationButtons } from '@/app/dashboard/_components/pagination-buttons'
import {
  InventoryProductType,
  OrderType,
  UsersType,
} from '@/app/dashboard/_components/admin/types'
import { DirectiveItem } from '@/app/dashboard/_components/admin/directives/directive-item'
import { OperativeItem } from '@/app/dashboard/_components/admin/operatives/operative-item'

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
  const ITEMS_PER_PAGE = 5

  const skipItems = (page - 1) * ITEMS_PER_PAGE

  const safeOrder = order === 'asc' ? 'asc' : 'desc'

  let products: InventoryProductType[] = []
  let orders: OrderType[] = []
  let users: UsersType[] = []
  let totalItems = 0
  let filters: { filter: string; text: string }[] = []

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

    const [fetchedProducts, productCount] = await Promise.all([
      prisma.product.findMany({
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
      }),
      prisma.product.count({ where: productWhereClause }),
    ])

    products = fetchedProducts
    totalItems = productCount
    filters = [
      { filter: 'id', text: 'Id' },
      { filter: 'name', text: 'Name' },
      { filter: 'category', text: 'Category' },
      { filter: 'quantity', text: 'Quantity' },
      { filter: 'price', text: 'Price' },
    ]
  } else if (mode === 'directives') {
    const allowedFilters = ['id', 'name', 'category', 'quantity', 'price']

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

    const [fetchedOrders, orderCount] = await Promise.all([
      prisma.order.findMany({
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
      }),
      prisma.order.count({ where: orderWhereClause }),
    ])

    orders = fetchedOrders
    totalItems = orderCount
    filters = [
      { filter: 'id', text: 'Id' },
      { filter: 'fullName', text: 'Full name' },
      { filter: 'totalAmount', text: 'Total amount' },
      { filter: 'city', text: 'City' },
      { filter: 'status', text: 'Status' },
    ]
  } else if (mode === 'operatives') {
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

    const [fetchedUsers, userCount] = await Promise.all([
      prisma.user.findMany({
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
      }),
      prisma.user.count({ where: userWhereClause }),
    ])

    users = fetchedUsers
    totalItems = userCount
    filters = [
      { filter: 'id', text: 'Id' },
      { filter: 'userName', text: 'Username' },
      { filter: 'email', text: 'Email' },
      { filter: 'city', text: 'City' },
    ]
  }

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  return (
    <div className="flex flex-col gap-8">
      <div className="relative h-110 w-full min-w-0 overflow-y-auto">
        <table className="w-225 table-fixed overflow-y-auto text-left 2xl:w-full">
          <thead className="text-text-second border-b">
            <TableHeader filters={filters} />
          </thead>
          <tbody>
            {mode === 'inventory'
              ? products.map((product) => (
                  <InventoryProduct key={product.id} product={product} />
                ))
              : mode === 'directives'
                ? orders.map((order) => (
                    <DirectiveItem key={order.id} order={order} />
                  ))
                : users.map((user) => (
                    <OperativeItem key={user.id} user={user} />
                  ))}
          </tbody>
        </table>
      </div>

      <PaginationButtons maxPages={totalPages} />
    </div>
  )
}
