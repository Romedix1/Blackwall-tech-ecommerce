export const LogsListSkeleton = () => {
  const skeletons = Array.from({ length: 14 })

  return (
    <ul className="mb-12 flex flex-col gap-4">
      {skeletons.map((_, index) => (
        <li key={index} className="skeleton-loading list-none">
          <button
            aria-hidden="true"
            disabled
            className="w-full items-center justify-between p-4 text-left outline-none"
          >
            <div className="flex items-center justify-between">
              <div className="flex w-10/12 opacity-0">
                <span className="text-sm font-bold uppercase">PLACEHOLDER</span>
                <span className="mx-2 text-xs">-</span>
                <span className="text-sm">PLACEHOLDER</span>
              </div>

              <div className="ml-2 shrink-0 text-sm font-bold opacity-0 outline-none">
                <span className="block">[v]</span>
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}
