import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

type AddToCartButtonSkeletonProps = {
  className?: string
}

export const AddToCartButtonSkeleton = ({
  className,
}: AddToCartButtonSkeletonProps) => {
  return (
    <Button disabled className={cn('skeleton-loading', className)}>
      <span aria-hidden="true" className="opacity-0">
        [ Add_to_cart ]
      </span>
    </Button>
  )
}
