export const OrdersChartSkeleton = () => {
  return (
    <div className="bg-surface flex h-100 w-full animate-pulse flex-col border p-6">
      <h2 className="mb-6 w-4/12 text-sm font-bold tracking-widest">
        <span className="sr-only">Loading chart...</span>
        <span
          aria-hidden="true"
          className="skeleton-loading inline-block w-full wrap-break-word opacity-0"
        >
          <span className="mr-2">{'//'}</span>
          Revenue_trajectory_30_days
        </span>
      </h2>

      <div className="skeleton-loading h-full w-full" />
    </div>
  )
}
