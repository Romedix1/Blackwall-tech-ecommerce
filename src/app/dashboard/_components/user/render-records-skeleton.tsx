import { Button } from '@/components/ui'

type SkeletonProps = {
  type: 'build' | 'order'
}

export const RecordBlockSkeleton = ({ type }: SkeletonProps) => {
  return (
    <li className="skeleton-loading list-none">
      <div className="mb-6 flex flex-col gap-2.5 p-4 lg:flex-row lg:justify-between lg:gap-10 lg:p-6">
        <p className="truncate text-xs uppercase opacity-0 lg:text-sm 2xl:text-base">
          <span className="mr-2" aria-hidden="true">
            &gt;
          </span>
          Directive:{' '}
          {type === 'build'
            ? 'configuration PLACEHOLDER'
            : 'order #PLACEHOLDER'}
        </p>

        <div>
          <p className="text-xs uppercase opacity-0 lg:text-sm 2xl:text-base">
            <span className="mr-2" aria-hidden="true">
              &gt;
            </span>
            Status: PLACEHOLDER
            {type === 'order' && <span> (Eta: 3_days)</span>}
          </p>

          {type === 'build' && (
            <p className="text-xs uppercase opacity-0 lg:text-sm 2xl:text-base">
              Broadcast: Private
            </p>
          )}
        </div>
      </div>

      {type === 'build' && (
        <div className="flex flex-col gap-4 p-4 pt-0 sm:flex-row lg:p-6 lg:pt-0">
          <Button disabled className="opacity-0">
            [ Broadcast ]
          </Button>

          <Button disabled variant="delete" className="opacity-0">
            [ Wipe ]
          </Button>
        </div>
      )}
    </li>
  )
}

export const RenderRecordsSkeleton = ({ type }: SkeletonProps) => {
  const skeletons = Array.from({ length: 3 })

  return (
    <ul className="flex max-h-100 flex-col gap-4 overflow-y-auto">
      {skeletons.map((_, index) => (
        <RecordBlockSkeleton key={index} type={type} />
      ))}
    </ul>
  )
}
