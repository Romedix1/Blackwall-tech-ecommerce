import { BestSellersContainer } from '@/app/(home)/_components/best-sellers/best-sellers-container'
import { Eyebrow } from '@/components/shared'

export const BestSellers = () => {
  return (
    <section className="container mx-auto flex flex-col gap-4 overflow-hidden sm:px-4">
      <Eyebrow>
        <span aria-hidden="true">{`//`} Best_sellers</span>
        <span className="sr-only">Best sellers</span>
      </Eyebrow>

      <BestSellersContainer />
    </section>
  )
}
