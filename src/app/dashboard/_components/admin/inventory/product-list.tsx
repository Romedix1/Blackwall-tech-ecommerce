import {
  InventoryProduct,
  PaginationButtons,
  TableSortableHeader,
} from '@/app/dashboard/_components/admin/inventory'
import { prisma } from '@/lib/prisma'
import { Prisma } from '../../../../../../generated/prisma'

type ProductListProps = {
  page: number
  order?: 'asc' | 'desc'
  filter?: string
  searchValue?: string
}

export const ProductList = async ({
  page,
  order,
  filter,
  searchValue,
}: ProductListProps) => {
  const ITEMS_PER_PAGE = 5

  const skipProducts = (page - 1) * ITEMS_PER_PAGE

  const allowedFilters = ['id', 'name', 'category', 'quantity', 'price']

  const safeFilter = allowedFilters.includes(filter as string) ? filter : 'id'

  const safeOrder = order === 'asc' ? 'asc' : 'desc'

  let orderByClause: Prisma.ProductOrderByWithRelationInput = {}

  if (safeFilter === 'category') {
    orderByClause = {
      category: {
        slug: safeOrder,
      },
    }
  } else {
    orderByClause = {
      [safeFilter as string]: safeOrder,
    }
  }

  const whereClause: Prisma.ProductWhereInput = searchValue
    ? {
        OR: [
          {
            id: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: searchValue,
              mode: 'insensitive',
            },
          },
        ],
      }
    : {}

  const products = await prisma.product.findMany({
    take: ITEMS_PER_PAGE,
    skip: skipProducts,
    where: whereClause,
    select: {
      id: true,
      name: true,
      category: {
        select: {
          slug: true,
        },
      },
      quantity: true,
      price: true,
    },
    orderBy: orderByClause,
  })

  const productCount = await prisma.product.count({})

  const totalPages = Math.ceil(productCount / ITEMS_PER_PAGE)

  return (
    <div className="flex flex-col gap-8">
      <div className="relative h-110 w-full min-w-0 overflow-y-auto">
        <table className="w-225 table-fixed overflow-y-auto text-left 2xl:w-full">
          <thead className="text-text-second border-b">
            <tr className="uppercase">
              <TableSortableHeader filter="id">Id</TableSortableHeader>

              <TableSortableHeader filter="name">Name</TableSortableHeader>

              <TableSortableHeader filter="category">
                Category
              </TableSortableHeader>

              <TableSortableHeader filter="quantity">
                Quantity
              </TableSortableHeader>

              <TableSortableHeader filter="price">Price</TableSortableHeader>

              <th className="w-1/6 p-4">
                <span className="sr-only">Action buttons</span>
                <span aria-hidden="true">Controls</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <InventoryProduct key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>

      <PaginationButtons maxPages={totalPages} />
    </div>
  )
}
