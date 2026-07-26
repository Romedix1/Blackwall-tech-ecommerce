import { BestSellersCardLayout } from './best-sellers-card-layout'

type BestSellersSkeletonProps = {
  count?: number
}

export const BestSellersCardSkeleton = ({
  count = 4,
}: BestSellersSkeletonProps) => {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, index) => (
        <div
          aria-hidden="true"
          key={`best-seller-skeleton-${index}`}
          className="skeleton-loading border-accent/15 h-full flex-1 overflow-hidden border"
        >
          <BestSellersCardLayout
            className="opacity-0"
            image={<div className="h-full w-full" />}
            badge="Badge"
            name="Product name"
            specs={
              <>
                <li className="mr-2">Spec one</li>
                <li className="mx-2">{'// Spec two'}</li>
                <li className="mx-2">{'// Spec three'}</li>
              </>
            }
            price={<>$ 000.00</>}
            action={<div className="h-11 w-full" />}
          />
        </div>
      ))}
    </div>
  )
}
