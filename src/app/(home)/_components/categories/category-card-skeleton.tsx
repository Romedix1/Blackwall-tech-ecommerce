import { cn } from '@/lib/utils'
import { CategoryCardLayout } from './category-card-layout'

const skeletonLayouts = ['lg:col-span-2', 'lg:row-span-2', '', '']

export const CategoryCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 sm:gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {skeletonLayouts.map((layoutClass, index) => (
        <div
          aria-hidden="true"
          key={`category-skeleton-${index}`}
          className={cn(
            'skeleton-loading border-accent/15 h-full w-full overflow-hidden border',
            layoutClass,
          )}
        >
          <CategoryCardLayout
            className="opacity-0"
            index="01"
            name="Category"
            productCountLabel="10 items"
            image={<div className="relative aspect-4/3 w-full" />}
          />
        </div>
      ))}
    </div>
  )
}
