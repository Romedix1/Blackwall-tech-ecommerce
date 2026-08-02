'use client'

import { InventoryProductType } from '@/app/dashboard/_components/admin/types'
import { DeleteModal } from '@/app/dashboard/_components/modals/delete-modal'
import { Button } from '@/components/ui'
import { cn } from '@/lib'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useState } from 'react'

type InventoryProductProps = {
  product: InventoryProductType
}

export const InventoryProduct = ({ product }: InventoryProductProps) => {
  const { data: session, status } = useSession()

  if (status === 'unauthenticated') {
    redirect('/')
  }

  const isDemoAdmin = session?.user?.role === 'demoAdmin'

  const [isDeleting, setIsDeleting] = useState(false)

  return (
    <>
      {isDeleting && (
        <DeleteModal
          mode="item"
          productId={product.id}
          productName={product.name}
          onClose={() => setIsDeleting(false)}
        />
      )}
      <tr className="hover:bg-accent/10 border-b">
        <td className="text-text-second w-1/6 truncate p-4">{product.id}</td>
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
        <td className="w-1/6 truncate p-4">$ {product.price.toFixed(2)}</td>

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

            <Button
              disabled={isDemoAdmin}
              variant="delete"
              onClick={() => setIsDeleting(true)}
            >
              <span className="sr-only">Delete product</span>
              <span aria-hidden="true">[ PURGE ]</span>
            </Button>
          </div>
        </td>
      </tr>
    </>
  )
}
