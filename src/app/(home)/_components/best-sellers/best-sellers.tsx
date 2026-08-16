import { BestSellersContainer } from '@/app/(home)/_components/best-sellers'
import { BestSellersCardSkeleton } from '@/app/(home)/_components/best-sellers/best-sellers-card-skeleton'
import { Eyebrow } from '@/components/shared'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { Suspense } from 'react'

export const BestSellers = () => {
  return (
    <section className="container mx-auto flex flex-col gap-4 overflow-hidden sm:px-4">
      <Eyebrow>
        <span aria-hidden="true">{`//`} Best_sellers</span>
        <span className="sr-only">Best sellers</span>
      </Eyebrow>

      <Suspense fallback={<BestSellersCardSkeleton />}>
        <BestSellersContainer />
      </Suspense>

      <Button
        asChild
        variant="secondary"
        className="border-border mt-8 flex items-center justify-center text-xs sm:text-base"
      >
        <Link href={'/categories'}>
          <span aria-hidden="true">{'//'} ---</span>
          <span aria-hidden="true" className="hidden sm:inline-block">
            --------
          </span>
          <span aria-hidden="true" className="hidden lg:inline-block">
            ---------------
          </span>{' '}
          <span>
            <span aria-hidden="true">[ </span>
            <span aria-hidden="true" className="uppercase">
              View_all_products
            </span>
            <span className="sr-only">View all products</span>
            <span aria-hidden="true"> ]</span>
          </span>
          <span aria-hidden="true"> ---</span>
          <span aria-hidden="true" className="hidden sm:inline-block">
            --------
          </span>
          <span aria-hidden="true" className="hidden lg:inline-block">
            ---------------
          </span>{' '}
          <span aria-hidden="true">{'//'}</span>
        </Link>
      </Button>
    </section>
  )
}
