export const BuilderSummarySkeleton = () => {
  return (
    <>
      <h3 className="text-text-second text-sm font-bold lg:text-base 2xl:text-xl">
        <span className="skeleton-loading inline-block">
          <span aria-hidden="true" className="opacity-0">
            {'//'} System_telemetry
          </span>
        </span>
      </h3>

      <div className="skeleton-loading mt-1 h-12 w-full" />

      <p className="text-sm font-bold lg:text-base">
        <span className="skeleton-loading inline-block">
          <span aria-hidden="true" className="opacity-0">
            [ Start_building ]
          </span>
        </span>
      </p>

      <p className="skeleton-loading">
        <span aria-hidden="true" className="mr-2 opacity-0">
          &gt;
        </span>
        <span className="inline-block">
          <span className="opacity-0">Total: $ 0.00</span>
        </span>
      </p>

      <div className="skeleton-loading flex h-14 w-full items-center justify-center">
        <span className="font-bold uppercase opacity-0">
          [ add_product_to_cart ]
        </span>
      </div>

      <div className="mt-16 flex flex-col gap-6">
        <div className="skeleton-loading h-12 w-full" />

        <div className="skeleton-loading flex h-14 w-full items-center justify-center">
          <span className="font-bold uppercase opacity-0">[ Broadcast ]</span>
        </div>
      </div>
    </>
  )
}
