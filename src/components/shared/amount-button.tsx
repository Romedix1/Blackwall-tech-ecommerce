'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

type AmountButtonProps = {
  slug: string
  className: string
  handleUpdate: (slug: string, quantity: number) => void
  quantity: number
}

export const AmountButton = ({
  className,
  slug,
  handleUpdate,
  quantity,
}: AmountButtonProps) => {
  const [amount, setAmount] = useState(quantity)

  const BUTTON_STYLE = 'terminal-hover cursor-pointer select-none'

  const handleDecrement = () => {
    if (amount > 1) {
      setAmount((prev) => prev - 1)
      handleUpdate(slug, amount)
    }
  }

  const handleIncrement = () => {
    setAmount((prev) => prev + 1)
    handleUpdate(slug, amount)
  }

  return (
    <div
      className={cn(
        'bg-surface flex h-full items-center justify-center gap-4 border px-3 py-3.5 font-bold lg:w-9/12',
        className,
      )}
    >
      <button onClick={handleDecrement} className={cn(BUTTON_STYLE)}>
        <span aria-hidden="true">[ - ]</span>
        <span className="sr-only">-</span>
      </button>

      {amount < 10 ? `0${amount}` : amount}

      <button onClick={handleIncrement} className={cn(BUTTON_STYLE)}>
        <span aria-hidden="true">[ + ]</span>
        <span className="sr-only">+</span>
      </button>
    </div>
  )
}
