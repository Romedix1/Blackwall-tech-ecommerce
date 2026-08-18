import {
  OrdersChartContainer,
  OrdersChartSkeleton,
  RenderMetrics,
  RenderMetricsSkeleton,
} from '@/app/dashboard/_components/admin'
import { DashboardHeader } from '@/app/dashboard/_components/layout/header'
import { RenderRecords, UserActivity } from '@/app/dashboard/_components/user'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export default async function UserDashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/')
    return null
  }

  const userOrders = await prisma.order.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      status: true,
      createdAt: true,
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  })

  const isUser = session.user.role === 'user'
  const isAdminOrDemo = ['admin', 'demoAdmin'].includes(session.user.role)

  //  @note PORTFOLIO_SIMULATION
  //  In production, ETA is fetched via a Logistics API (e.g., DHL/InPost).
  //  This is a deterministic simulation using the Order ID as a seed to
  //  ensure UI consistency across sessions without random "jumps" on refresh.

  return (
    <>
      {isUser && (
        <>
          <DashboardHeader>
            <span aria-hidden="true">{'//'} Welcome_back, </span>
            <span className="sr-only">Welcome back, </span>
            {session.user.name}
          </DashboardHeader>

          <RenderRecords type="order" records={userOrders} />
          <UserActivity />
        </>
      )}

      {isAdminOrDemo && (
        <>
          <DashboardHeader>
            <span className="sr-only">core metrics: system overview</span>
            <span aria-hidden="true">{'//'} Core_metrics: system_overview</span>
          </DashboardHeader>

          <div className="w-full max-w-full overflow-hidden">
            <div className="relative w-full min-w-0">
              <Suspense fallback={<RenderMetricsSkeleton />}>
                <RenderMetrics />
              </Suspense>
            </div>
          </div>

          <Suspense fallback={<OrdersChartSkeleton />}>
            <OrdersChartContainer />
          </Suspense>
        </>
      )}
    </>
  )
}
