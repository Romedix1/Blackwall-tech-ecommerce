import {
  PaginationButtons,
  TableSortableHeader,
} from '@/app/dashboard/_components/admin/inventory'
import { Button } from '@/components/ui'
import { cn } from '@/lib'
import { prisma } from '@/lib/prisma'
import { Prisma } from '../../../../../../generated/prisma'
import Link from 'next/link'

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
              <tr key={product.id} className="hover:bg-accent/10 border-b">
                <td className="text-text-second w-1/6 truncate p-4">
                  {product.id}
                </td>
                <td className="w-1/6 truncate p-4 font-bold">{product.name}</td>
                <td className="text-text-second w-1/6 truncate p-4 uppercase">
                  [ {product.category?.slug} ]
                </td>
                <td
                  className={cn(
                    'w-1/6 truncate p-4 font-bold',
                    product.quantity < 10
                      ? 'text-error-text'
                      : product.quantity >= 10 && product.quantity <= 50
                        ? 'text-warning'
                        : 'text-accent',
                  )}
                >
                  {product.quantity}
                </td>
                <td className="w-1/6 truncate p-4">
                  $ {product.price.toFixed(2)}
                </td>

                <td className="w-1/6 p-4">
                  <div className="flex flex-col items-center justify-end gap-4">
                    <Button
                      asChild
                      variant="secondary"
                      className="flex items-center justify-center"
                    >
                      <Link href={`/dashboard/inventory/edit/${product.id}`}>
                        <span className="sr-only">Edit product</span>
                        <span aria-hidden="true">[ EDIT ]</span>
                      </Link>
                    </Button>

                    <Button variant="delete">
                      <span className="sr-only">Delete product</span>
                      <span aria-hidden="true">[ PURGE ]</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationButtons maxPages={totalPages} />
    </div>
  )
}
