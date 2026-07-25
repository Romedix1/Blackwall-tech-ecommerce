export const RenderMetricsSkeleton = () => {
  const skeletonItems = [...Array(4)]

  return (
    <ul className="flex gap-4 overflow-x-auto">
      {skeletonItems.map((_, index) => (
        <li
          key={index}
          className="skeleton-loading flex flex-1 flex-col gap-2.5 p-4"
        >
          <span className="opacity-0" aria-hidden="true">
            <h2 className="font-bold uppercase">
              <span className="inline-block wrap-break-word" aria-hidden="true">
                <span className="mr-2">&gt;</span>
                PLACEHOLDER
              </span>
            </h2>

            <p className="text-accent font-bold">00000.00</p>
          </span>
        </li>
      ))}
    </ul>
  )
}
