export const FiltersSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="skeleton-loading h-10 w-full"></div>
        <div className="skeleton-loading h-4 w-1/2"></div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="skeleton-loading h-1 w-full"></div>
        <div className="flex justify-between">
          <div className="skeleton-loading h-4 w-16"></div>
          <div className="skeleton-loading h-4 w-16"></div>
        </div>
      </div>

      {Array.from({ length: 4 }).map((_, sectionIndex) => (
        <div key={sectionIndex} className="flex flex-col gap-3">
          <div className="bg-accent/90 h-5 w-2/3"></div>

          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, itemIndex) => (
              <div key={itemIndex} className="flex items-center gap-3">
                <div className="skeleton-loading h-4 w-4 shrink-0"></div>
                <div className="skeleton-loading h-4 w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
