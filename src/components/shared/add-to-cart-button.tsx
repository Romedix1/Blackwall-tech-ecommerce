import { Button } from '@/components/ui'
import { MouseEvent } from 'react'

type AddToCartButtonProps = {
  className?: string
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}

export const AddToCartButton = ({
  className,
  onClick,
}: AddToCartButtonProps) => {
  return (
    <Button onClick={onClick} variant="primary" className={className}>
      <span aria-hidden="true">[ Add_to_cart ]</span>
      <span className="sr-only">Add to cart</span>
    </Button>
  )
}
