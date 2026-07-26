import { BestSellersCardLayout } from '@/app/(home)/_components/best-sellers/best-sellers-card-layout'
import { AddToCartButton } from '@/components/shared/add-to-cart-button'
import { BackgroundGlow, ImageNotFound } from '@/components/ui'
import { cn } from '@/lib/utils'
import { AttributeType, SpecSection } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

type ProductType = {
  name: string
  badge: ReactNode
  specs: SpecSection[]
  slug: string
  price: number
  image: string | null
  stock: number
}

type BestSellersCardType = {
  product: ProductType
}

export const BestSellersCard = ({ product }: BestSellersCardType) => {
  const cartProduct = {
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image,
    stock: product.stock,
  }

  const flatSpecs = product.specs.flatMap(
    (section: SpecSection) =>
      section.attributes?.map((attr: AttributeType) => attr.value) || [],
  )
  const displaySpecs = flatSpecs.slice(0, 3)

  return (
    <article className="flex-1 overflow-hidden">
      <Link
        href={`/product/${product.slug}`}
        aria-label={`View details for ${product.name}`}
        className="bg-surface focus:border-accent group hover:border-accent flex h-full cursor-pointer border outline-none"
      >
        <BestSellersCardLayout
          image={
            <>
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  className="relative z-20 h-full w-full object-contain drop-shadow-xl"
                  width={1600}
                  height={1200}
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  priority
                  quality={80}
                />
              ) : (
                <ImageNotFound />
              )}

              <BackgroundGlow className="bg-accent/30 top-1/2 left-1/2 z-10 h-[80%] w-[70%] -translate-x-1/2 -translate-y-1/2 rotate-150 blur-2xl group-hover:scale-145 group-focus:scale-145 lg:h-full lg:w-full lg:blur-2xl" />
            </>
          }
          badge={product.badge}
          name={product.name}
          specs={displaySpecs.map((specValue, index) => (
            <li key={`spec-${index}`} className="flex items-center">
              <span aria-hidden="true">{index !== 0 ? '//' : ''}</span>
              <span className={cn(index === 0 ? 'mr-2' : 'mx-2')}>
                {String(specValue)}
              </span>
            </li>
          ))}
          price={<>$ {Number(product.price).toFixed(2)}</>}
          action={<AddToCartButton product={{ ...cartProduct, stock: 1 }} />}
        />
      </Link>
    </article>
  )
}
