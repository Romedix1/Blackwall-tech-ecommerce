import { BackButton } from '@/app/dashboard/(dashboard)/(fullscreen)/_components'
import { cn } from '@/lib/utils'

const INPUT_SKELETON = 'skeleton-loading h-12 w-full '
const BUTTON_SKELETON = 'skeleton-loading h-14 w-full mt-6'
const REMOVE_BTN_SKELETON = 'skeleton-loading h-12 w-full md:w-[256px]'
const HEADER_WRAPPER = 'skeleton-loading inline-block'
const HEADER_TEXT = 'font-bold uppercase opacity-0'

export default function EditProductLoading() {
  const mockTechnical = Array.from({ length: 3 })
  const mockPerformance = Array.from({ length: 2 })
  const mockSpecifications = Array.from({ length: 2 })
  const mockSpecificationsItems = Array.from({ length: 2 })

  return (
    <div className="container mx-auto mt-8">
      <BackButton link="/dashboard/inventory" />

      <div className="mt-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <div className={INPUT_SKELETON} />
          </div>
          <div className="sm:col-span-2">
            <div className={INPUT_SKELETON} />
          </div>
          <div className="sm:col-span-1">
            <div className={INPUT_SKELETON} />
          </div>
          <div className="sm:col-span-1">
            <div className={INPUT_SKELETON} />
          </div>
          <div className="sm:col-span-2">
            <div className={INPUT_SKELETON} />
          </div>
          <div className="sm:col-span-2">
            <div className={INPUT_SKELETON} />
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-6">
            <span className={HEADER_WRAPPER}>
              <span aria-hidden="true" className={HEADER_TEXT}>
                Technical_section
              </span>
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {mockTechnical.map((_, index) => (
              <div key={`tech-skeleton-${index}`} className="gap-4 md:flex">
                <div className="mb-4 flex gap-4 md:flex-1">
                  <div className="min-w-0 flex-1">
                    <div className={INPUT_SKELETON} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={INPUT_SKELETON} />
                  </div>
                </div>
                <div className={REMOVE_BTN_SKELETON} />
              </div>
            ))}
          </div>

          <div className={BUTTON_SKELETON} />
        </div>

        <div className="mt-8">
          <div className="mb-6">
            <span className={HEADER_WRAPPER}>
              <span aria-hidden="true" className={HEADER_TEXT}>
                Performance
              </span>
            </span>
          </div>
          <div className="flex flex-col gap-8">
            {mockPerformance.map((_, index) => (
              <div key={`perf-skeleton-${index}`}>
                <div className="mb-6 flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className={INPUT_SKELETON} />
                  </div>
                  <div className="skeleton-loading h-10 min-w-0 flex-1" />
                </div>
                <div className="border-accent/20 flex flex-col gap-2 border-l-2 pl-4">
                  <div className="gap-4 md:flex">
                    <div className="flex gap-4 md:flex-1">
                      <div className="min-w-0 flex-1">
                        <div className={INPUT_SKELETON} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={INPUT_SKELETON} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={cn(BUTTON_SKELETON, 'mt-8')} />
        </div>

        <div className="mt-8">
          <div className="mb-6">
            <span className={HEADER_WRAPPER}>
              <span aria-hidden="true" className={HEADER_TEXT}>
                Detailed_Specifications
              </span>
            </span>
          </div>
          <div className="flex flex-col gap-8">
            {mockSpecifications.map((_, specIndex) => (
              <div key={`spec-skeleton-${specIndex}`}>
                <div className="mb-6 flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className={INPUT_SKELETON} />
                  </div>
                  <div className="skeleton-loading h-10 min-w-0 flex-1" />
                </div>
                <div className="border-accent/20 flex flex-col gap-2 border-l-2 pl-4">
                  {mockSpecificationsItems.map((_, attrIndex) => (
                    <div
                      key={`attr-skeleton-${specIndex}-${attrIndex}`}
                      className="gap-4 md:flex"
                    >
                      <div className="mb-4 flex gap-4 md:flex-1">
                        <div className="min-w-0 flex-1">
                          <div className={INPUT_SKELETON} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={INPUT_SKELETON} />
                        </div>
                      </div>
                      <div className={REMOVE_BTN_SKELETON} />
                    </div>
                  ))}

                  <div className={BUTTON_SKELETON} />
                </div>
              </div>
            ))}
          </div>
          <div className={cn(BUTTON_SKELETON, 'mt-8')} />
        </div>

        <div className="border-accent/40 my-12 border-t"></div>

        <div className="skeleton-loading mt-8 flex h-14 w-full items-center justify-center">
          <span aria-hidden="true" className={HEADER_TEXT}>
            [ Update_data ]
          </span>
        </div>
      </div>
    </div>
  )
}
