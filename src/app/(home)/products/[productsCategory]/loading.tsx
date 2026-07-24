import { FiltersSkeleton } from '@/components/ui/filter-skeleton'
import { ProductSkeleton } from '@/components/ui/product-skeleton'

export default function Loading() {
  const skeletons = Array.from({ length: 6 })

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col gap-y-2 sm:justify-between md:flex-row lg:mb-16">
        <header className="w-full">
          <div className="skeleton-loading h-10 w-3/4 max-w-md"></div>
        </header>

        <div className="skeleton-loading h-6 w-1/3 max-w-xs"></div>
      </div>

      <div className="my-4 flex items-center justify-between gap-4 lg:hidden">
        <div className="skeleton-loading h-10 w-24"></div>
        <div className="skeleton-loading h-10 w-24"></div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[260px_1fr] lg:gap-16">
        <aside className="hidden lg:block">
          <FiltersSkeleton />

          <div className="skeleton-loading mt-8 h-10 w-full"></div>
        </aside>

        <div className="flex flex-col gap-y-8">
          <div className="hidden lg:block">
            <div className="skeleton-loading mb-4 h-10 w-48"></div>
            <div className="skeleton-loading h-px w-full"></div>
          </div>

          <section className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-6">
            {skeletons.map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}
