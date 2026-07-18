'use client'

import { Button } from '@/components/ui'
import { useCart } from '@/hooks'
import Link from 'next/link'

type ProductType = {
  slug: string
  name: string
  price: number
  quantity: number
  category: { slug: string }
}

type HeroActionsProps = {
  product: ProductType
  isLoggedIn: boolean
  productImg: string | null
}

export const HeroActions = ({
  product,
  isLoggedIn,
  productImg,
}: HeroActionsProps) => {
  const { addItem } = useCart()

  const handleAddItem = async () => {
    addItem(
      product.slug,
      product.name,
      product.price,
      1,
      productImg,
      product.quantity,
      isLoggedIn,
    )
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row lg:w-125 xl:w-155">
      <Button variant="primary" className="w-full" onClick={handleAddItem}>
        <span aria-hidden="true">[ Initialize purchase ]</span>
        <span className="sr-only">
          Initialize purchase and view product: {product.name}
        </span>
      </Button>
      <Button
        variant="secondary"
        className="flex w-full items-center justify-center"
        asChild
      >
        <Link href={`/product/${product.slug}`}>
          <span aria-hidden="true">[ Decode specs ]</span>
          <span className="sr-only">
            View technical specifications and hardware details for{' '}
            {product.name}
          </span>
        </Link>
      </Button>
    </div>
  )
}
