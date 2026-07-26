import { cn } from '@/lib/utils'

export const CategoriesSkeleton = () => {
  const skeletonLayouts = ['lg:col-span-2', 'lg:row-span-2', '', '']

  return (
    <div className="flex flex-col gap-4 sm:gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {skeletonLayouts.map((layoutClass, index) => (
        <div
          aria-hidden="true"
          key={`category-skeleton-${index}`}
          className={cn('skeleton-loading h-full w-full', layoutClass)}
        >
          <div className="flex h-full flex-col gap-8 p-5 opacity-0 md:flex-1">
            <div className="flex justify-between gap-4">
              <div className="flex flex-col xl:flex-row xl:gap-2">
                <div className="flex justify-between font-medium uppercase">
                  <p className="text-xs xl:text-base">01/</p>
                </div>
                <h3 className="text-2xl font-bold uppercase xl:text-[32px]">
                  Category
                </h3>
              </div>
              <p className="text-right text-sm font-medium uppercase">
                {'// 10 items'}
              </p>
            </div>

            <div className="relative aspect-4/3 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
