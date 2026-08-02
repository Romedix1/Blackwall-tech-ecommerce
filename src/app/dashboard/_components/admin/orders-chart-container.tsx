import { OrdersChart } from '@/app/dashboard/_components/admin/orders-chart'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export const OrdersChartContainer = async () => {
  const session = await auth()

  if (!session) {
    redirect('/')
  }

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  let chartData: { label: string; amount: number }[] = []

  const isAdminOrDemo = ['admin', 'demoAdmin'].includes(session.user.role)

  if (isAdminOrDemo) {
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

  return <OrdersChart data={chartData} />
}
