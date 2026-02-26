import { Button } from '@/components/ui'
import { ReactNode } from 'react'

type ProductType = {
  name: string
  badge: ReactNode
  specs: string[]
  price: string
  image: ReactNode
}

type BestSellersCardType = {
  product: ProductType
}

export const BestSellersCard = ({ product }: BestSellersCardType) => {
  return (
    <article className="bg-surface focus:border-accent hover:border-accent group relative flex w-67.5 min-w-0 shrink-0 cursor-pointer flex-col overflow-hidden border p-6 sm:w-75 xl:w-auto xl:flex-1">
      <div>
        {product.image}

        <p className="text-accent mb-2 text-[11px] font-medium lg:text-sm">
          {product.badge}
        </p>
        <h3 className="mb-1 text-xl font-bold uppercase lg:text-2xl">
          {product.name}
        </h3>
        <p className="text-text-second mb-5 text-[11px] font-medium lg:text-sm">
          {product.specs.map((spec, index) => {
            return (
              <span key={`spec-${index}`} className="uppercase">
                <span aria-hidden="true">{`${index !== 0 ? ' ' : ''}// `}</span>
                {spec}
              </span>
            )
          })}
        </p>
      </div>
      <div className="mt-auto">
        <p className="text-accent mb-8 text-xl font-medium lg:text-2xl">
          $ {product.price}
        </p>

        <Button variant="secondary">
          <span aria-hidden="true">[ Add_to_cart ]</span>
          <span className="sr-only">Add to cart</span>
        </Button>
      </div>
    </article>
  )
}
