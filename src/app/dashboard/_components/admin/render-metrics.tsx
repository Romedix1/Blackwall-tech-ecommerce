import { MetricBlock } from '@/app/dashboard/_components/admin/metric-block'
import { prisma } from '@/lib/prisma'

export const RenderMetrics = async () => {
  const activeThreshold = new Date(new Date().getTime() - 10 * 60 * 1000)

  const [
    revenueData,
    publicBuildsCount,
    totalBuildsCount,
    criticalStockCount,
    activeUsersCount,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalAmount: true },
    }),
    prisma.build.count({ where: { public: true } }),
    prisma.build.count({}),
    prisma.product.count({
      where: { quantity: { lt: 5 } },
    }),
    prisma.user.count({
      where: { lastActiveAt: { gte: activeThreshold } },
    }),
  ])

  const publicBuildPercentage =
    totalBuildsCount > 0
      ? ((publicBuildsCount / totalBuildsCount) * 100).toFixed(1)
      : '0.0'

  const totalRevenueValue = revenueData._sum.totalAmount || 0

  const METRIC_DATA = [
    { header: 'Total revenue', value: `$${totalRevenueValue}` },
    { header: 'Public exposure', value: `${publicBuildPercentage}%` },
    { header: 'Critical stock', value: criticalStockCount },
    { header: 'Active operatives', value: activeUsersCount },
  ]

  return (
    <ul className="flex gap-4 overflow-x-auto">
      {METRIC_DATA.map((metric) => (
        <MetricBlock
          key={metric.header}
          header={metric.header}
          value={metric.value}
        />
      ))}
    </ul>
  )
}
