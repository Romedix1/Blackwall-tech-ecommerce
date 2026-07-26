import { SearchShell } from '@/app/(home)/pc-builder/[category]/[id]/_components'

export default function BuilderCategoryLoading() {
  const mockFilters = Array.from({ length: 6 })
  const mockProducts = Array.from({ length: 4 })

  return (
    <div className="flex flex-col gap-4">
      <SearchShell />
      <div className="flex gap-4 overflow-hidden pb-2">
        {mockFilters.map((_, index) => (
          <div
            key={`filter-skeleton-${index}`}
            className="skeleton-loading h-9 w-24 shrink-0"
          />
        ))}
      </div>

      <div className="flex h-120 flex-col gap-4 overflow-hidden xl:h-200">
        {mockProducts.map((_, index) => (
          <div
            key={`product-skeleton-${index}`}
            className="skeleton-loading flex flex-col gap-6 border px-6 py-4 sm:gap-12"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="bg-surface/40 aspect-video h-30 w-full shrink-0 sm:w-53.25 xl:h-36 xl:w-[256px]" />

                <div>
                  <p className="font-bold opacity-0 xl:text-lg">
                    [ PLACEHOLDER ]
                  </p>
                  <p className="mt-4 hidden text-lg font-bold opacity-0 sm:block xl:text-xl">
                    $ 999.00
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-4 xl:grid-cols-2">
                {Array.from({ length: 4 }).map((_, specIndex) => (
                  <div key={specIndex} className="flex flex-col gap-2">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="h-px w-2"></span>
                      <h4 className="text-xs tracking-widest uppercase opacity-0 xl:text-sm">
                        PLACEHOLDER
                      </h4>
                    </div>

                    <div className="flex flex-col gap-1">
                      {Array.from({ length: 2 }).map((_, attrIndex) => (
                        <div
                          key={attrIndex}
                          className="flex justify-between pb-1 text-xs xl:text-sm"
                        >
                          <span className="mr-4 uppercase opacity-0">
                            PLACEHOLDER
                          </span>
                          <span className="text-right font-medium opacity-0">
                            PLACEHOLDER
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-lg font-bold opacity-0 sm:hidden">$ 999.00</p>
            </div>

            <div className="flex flex-col-reverse gap-3 lg:flex-row-reverse lg:gap-4">
              <div className="bg-surface/40 flex h-12 w-full items-center justify-center">
                <span className="font-bold opacity-0">[ PLACEHOLDER ]</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
