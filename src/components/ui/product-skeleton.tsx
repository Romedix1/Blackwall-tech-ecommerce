export const ProductSkeleton = () => {
  return (
    <article className="h-full">
      <div className="flex h-full flex-col gap-6 border p-4">
        <div className="relative flex aspect-4/3 w-full flex-col items-center justify-center">
          <div className="skeleton-loading h-full w-full"></div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="skeleton-loading h-5 w-full"></div>
          <div className="skeleton-loading h-5 w-3/4"></div>
        </div>

        <div className="skeleton-loading h-14 w-full"></div>
      </div>
    </article>
  )
}
