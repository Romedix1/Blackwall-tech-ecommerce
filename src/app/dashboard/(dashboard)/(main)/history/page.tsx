import { DashboardHeader } from '@/app/dashboard/_components/layout/header'
import {
  RenderRecords,
  RenderRecordsSkeleton,
} from '@/app/dashboard/_components/user'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export default async function DashboardHistoryPage() {
  const user = await auth()

  if (!user) {
    redirect('/')
  }

  const userOrders = await prisma.order.findMany({
    where: { userId: user.user.id },
    select: {
      id: true,
      status: true,
      createdAt: true,
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <DashboardHeader>
        <span aria-hidden="true">
          {'//'} Procurement_logs
          <span className="text-accent"> [{userOrders.length}]</span>
        </span>
        <span className="sr-only">
          Procurement logs, {userOrders.length} items found
        </span>
      </DashboardHeader>

      <Suspense fallback={<RenderRecordsSkeleton type="order" />}>
        <RenderRecords type="order" records={userOrders} />
      </Suspense>
    </>
  )
}
