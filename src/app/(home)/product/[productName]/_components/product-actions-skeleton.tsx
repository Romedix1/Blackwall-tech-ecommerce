import { AmountButtonSkeleton } from '@/app/(home)/product/[productName]/_components/amount-button-skeleton'
import { AddToCartButtonSkeleton } from '@/components/shared/add-to-cart-button-skeleton'

export const ProductActionsSkeleton = () => {
  return (
    <div className="mb-12 flex flex-col items-stretch gap-4 lg:mb-0 lg:flex-row">
      <AmountButtonSkeleton />

      <AddToCartButtonSkeleton className="h-full w-full px-1.5 py-3.5" />
    </div>
  )
}
