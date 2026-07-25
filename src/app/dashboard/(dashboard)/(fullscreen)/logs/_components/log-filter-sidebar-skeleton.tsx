import { Button } from '@/components/ui'

export const LogFilterSidebarSkeleton = () => {
  const skeletons = Array.from({ length: 16 })

  return (
    <div className="md:flex md:gap-6 lg:flex-col">
      <Button
        disabled
        className="text-accent mt-6 h-fit w-full animate-pulse px-4 py-3 text-xs uppercase sm:px-6 sm:text-sm md:mt-0 md:w-full lg:hidden"
        variant="secondary"
      >
        <span aria-hidden="true" className="opacity-0">
          [ + ] Filters
        </span>
      </Button>

      <div className="hidden flex-col gap-8 lg:flex">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col flex-nowrap gap-3 md:flex-row md:flex-wrap">
            {skeletons.map((_, index) => (
              <div key={index} className="skeleton-loading h-9 w-24" />
            ))}
          </div>

          <div className="skeleton-loading mt-6 h-5 w-40" />
        </div>
      </div>
    </div>
  )
}
