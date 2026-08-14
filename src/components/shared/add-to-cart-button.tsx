'use client'

import { Button } from '@/components/ui'
import { useCart } from '@/hooks'
import { useSession } from 'next-auth/react'
import { MouseEvent, useEffect, useRef, useState } from 'react'

type ProductType = {
  slug: string
  name: string
  price: number
  image: string | null
  quantity?: number
  stock: number
}

type AddToCartButtonProps = {
  className?: string
  quantity?: number
  product: ProductType
}

export const AddToCartButton = ({
  product,
  className,
  quantity = 1,
}: AddToCartButtonProps) => {
  const [isAdded, setIsAdded] = useState(false)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { addItem } = useCart()

  const { status } = useSession()
  const isAuth = status === 'authenticated'

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    addItem(
      product.slug,
      product.name,
      product.price,
      quantity,
      product.image,
      product.stock,
      isAuth,
    )

    setIsAdded(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => setIsAdded(false), 1000)
  }

  return (
    <Button onClick={handleAddToCart} variant="primary" className={className}>
      <span aria-hidden="true">
        [ {!isAdded ? 'Add_to_cart' : 'Product_added'} ]
      </span>
      <span className="sr-only">
        {!isAdded ? 'Add to cart' : 'Product added'}
      </span>
    </Button>
  )
}
