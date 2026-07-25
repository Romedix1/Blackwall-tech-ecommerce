import { Separator } from '@/components/ui'
import { SpecificationListSkeleton } from '@/app/(home)/product/[productName]/_components/specification-list-skeleton'
import { ProductActionsSkeleton } from '@/app/(home)/product/[productName]/_components/product-actions-skeleton'

export default function ProductLoading() {
  return (
    <div className="container mx-auto mt-16">
      <div className="lg:mb-24 lg:grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-16">
        <div className="col-start-2 mb-6 gap-2">
          <div className="skeleton-loading h-4 w-2/3" />
          <div className="skeleton-loading mt-2 h-8 w-3/4 lg:h-10" />
        </div>

        <div className="skeleton-loading relative row-span-2 row-start-1 min-h-100" />

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div className="skeleton-loading h-8 w-32" />
            <div className="skeleton-loading h-4 w-32" />
          </div>

          <Separator className="my-4 opacity-30 lg:my-8" />

          <ProductActionsSkeleton />
        </div>
      </div>

      <SpecificationListSkeleton />
    </div>
  )
}
