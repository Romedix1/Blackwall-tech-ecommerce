import { SectionHeader } from '@/app/(home)/product/[productName]/_components'

export const PerformanceBenchmarkSkeleton = () => {
  const fakeBenchmarks = Array.from({ length: 3 })

  return (
    <div className="mt-12 flex flex-col gap-8 uppercase lg:mb-32 lg:gap-2">
      <SectionHeader text="Performance benchmarks" />

      <ul className="flex flex-col gap-6">
        {fakeBenchmarks.map((_, index) => (
          <li key={index} className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="skeleton-loading h-4 w-1/3" />
              <div className="skeleton-loading h-4 w-12" />
            </div>

            <div className="skeleton-loading h-2 w-full" />
          </li>
        ))}
      </ul>
    </div>
  )
}
