import { cn } from '@/lib/utils'

type AmountButtonSkeletonProps = {
  className?: string
}

export const AmountButtonSkeleton = ({}: AmountButtonSkeletonProps) => {
  const BUTTON_STYLE = 'opacity-0'

  return (
    <div className="skeleton-loading flex h-full items-center justify-center gap-4 border px-3 py-3.5 lg:w-9/12">
      <button disabled className={cn(BUTTON_STYLE)}>
        <span aria-hidden="true">[ - ]</span>
      </button>

      <span className="opacity-0">01</span>

      <button disabled className={cn(BUTTON_STYLE)}>
        <span aria-hidden="true">[ + ]</span>
      </button>
    </div>
  )
}
