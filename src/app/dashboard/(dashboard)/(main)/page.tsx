import { UserActivity } from '@/app/dashboard/_components'
import { DashboardHeader } from '@/app/dashboard/_components'
import { RenderMetrics } from '@/app/dashboard/_components'
import { RenderRecords } from '@/app/dashboard/_components'
import { OrdersChart } from '@/app/dashboard/_components/admin/orders-chart'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function UserDashboardPage() {
  const user = await auth()

  if (!user) {
    redirect('/')
    return null
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

  //  @note PORTFOLIO_SIMULATION
  //  In production, ETA is fetched via a Logistics API (e.g., DHL/InPost).
  //  This is a deterministic simulation using the Order ID as a seed to
  //  ensure UI consistency across sessions without random "jumps" on refresh.

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  let chartData: { label: string; amount: number }[] = []

  if (user.user.role === 'admin') {
    const allOrders = await prisma.order.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: {
        createdAt: true,
      },
    })

    const chartMap: Record<string, number> = {}

    for (let i = 30; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      const label = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })

      chartMap[label] = 0
    }

    allOrders.forEach((order) => {
      const label = order.createdAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })

      if (chartMap[label] !== undefined) {
        chartMap[label] += 1
      }
    })

    chartData = Object.entries(chartMap).map(([label, amount]) => ({
      label,
      amount,
    }))
  }

  return (
    <>
      {user.user.role === 'user' ? (
        <>
          <DashboardHeader>
            <span aria-hidden="true">{'//'} Welcome_back, </span>
            <span className="sr-only">Welcome back, </span>
            {user.user.name}
          </DashboardHeader>

          <RenderRecords type="order" records={userOrders} />
          <UserActivity />
        </>
      ) : (
        <>
          <DashboardHeader>
            <span className="sr-only">core metrics: system overview</span>
            <span aria-hidden="true">{'//'} Core_metrics: sytem_overview</span>
          </DashboardHeader>

          <div className="w-full max-w-full overflow-hidden">
            <div className="relative w-full min-w-0">
              <RenderMetrics />
            </div>
          </div>
          <OrdersChart data={chartData} />
        </>
      )}
    </>
  )
}
