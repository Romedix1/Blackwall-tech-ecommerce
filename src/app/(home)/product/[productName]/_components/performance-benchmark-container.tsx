import { prisma } from '@/lib/prisma'
import { PerformanceBenchmark } from './performance-benchmark'
import { BenchmarkType } from '@/types'

type PerformanceBenchmarkContainerProps = {
  slug: string
}

export const PerformanceBenchmarkContainer = async ({
  slug,
}: PerformanceBenchmarkContainerProps) => {
  const product = await prisma.product.findUnique({
    where: { slug: slug },
    select: {
      performance: true,
    },
  })

  if (
    !product?.performance ||
    !Array.isArray(product.performance) ||
    product.performance.length === 0
  ) {
    return null
  }

  return (
    <PerformanceBenchmark
      performance={product.performance as BenchmarkType[]}
    />
  )
}
