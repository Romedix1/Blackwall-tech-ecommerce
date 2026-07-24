export const HeroActionsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row lg:col-start-1 lg:row-start-2 lg:w-125 xl:w-155">
      <div className="skeleton-loading h-14 w-full"></div>

      <div className="skeleton-loading h-14 w-full"></div>
    </div>
  )
}
