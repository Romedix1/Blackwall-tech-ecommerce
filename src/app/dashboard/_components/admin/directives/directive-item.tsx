'use client'

import { OrderType } from '@/app/dashboard/_components/admin/types'
import { DeleteModal } from '@/app/dashboard/_components/modals/delete-modal'
import { Button } from '@/components/ui'
import { cn } from '@/lib'
import Link from 'next/link'
import { useState } from 'react'

type InventoryProductProps = {
  order: OrderType
}

export const DirectiveItem = ({ order }: InventoryProductProps) => {
  const statusColorMap: Record<string, string> = {
    failed: 'text-error-text',
    pending: 'text-warning',
    paid: 'text-accent',
    shipped: 'text-accent',
    complete: 'text-accent',
  }

  return (
    <>
      <tr className="hover:bg-accent/10 border-b">
        <td className="text-text-second w-1/6 truncate p-4">{order.id}</td>
        <td className="w-1/6 truncate p-4 font-bold">{order.fullName}</td>
        <td className="text-text-second w-1/6 truncate p-4 uppercase">
          $ {order.totalAmount.toFixed(2)}
        </td>
        <td className="w-1/6 truncate p-4 font-bold">{order.city}</td>
        <td
          className={cn(
            'w-1/6 truncate p-4 font-bold uppercase',
            statusColorMap[order.status] || 'text-text-second',
          )}
        >
          {order.status}
        </td>
        <td className="w-1/6 p-4">
          <div className="flex flex-col items-center justify-end gap-4">
            <Button
              asChild
              variant="secondary"
              className="flex items-center justify-center"
            >
              <Link href={`/dashboard/directive/${order.id}`}>
                <span className="sr-only">Check order</span>
                <span aria-hidden="true">[ Check ]</span>
              </Link>
            </Button>
          </div>
        </td>
      </tr>
    </>
  )
}
