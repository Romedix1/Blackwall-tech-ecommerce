'use client'

import * as Slider from '@radix-ui/react-slider'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

type PriceSliderProps = {
  maxProductsPrice: number
}

export const PriceSlider = ({ maxProductsPrice }: PriceSliderProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const searchParams = useSearchParams()

  const [priceFilter, setPriceFilter] = useState({
    min: 0,
    max: maxProductsPrice,
  })

  const handleValueChange = (newValues: number[]) => {
    setPriceFilter({
      min: newValues[0],
      max: newValues[1],
    })
  }

  const handleValueCommit = (newValues: number[]) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set('priceMin', newValues[0].toString())
    params.set('priceMax', newValues[1].toString())

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="w-full">
      <Slider.Root
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
        defaultValue={[0, maxProductsPrice]}
        min={0}
        max={maxProductsPrice}
        step={1}
        minStepsBetweenThumbs={1}
        className="relative flex h-5 w-full items-center select-none"
      >
        <Slider.Track className="bg-border relative h-1.5 grow rounded-full">
          <Slider.Range className="bg-accent absolute h-full" />
        </Slider.Track>

        <Slider.Thumb
          className="border-accent bg-bg-main hover:bg-surface-hover focus:outline-accent bg-accent block h-4 w-2 cursor-grab border-2 focus:outline-2 focus:outline-offset-4 active:cursor-grabbing"
          aria-label="Minimal price"
        />

        <Slider.Thumb
          className="border-accent bg-bg-main hover:bg-surface-hover focus:outline-accent bg-accent block h-4 w-2 cursor-grab border-2 focus:outline-2 focus:outline-offset-4 active:cursor-grabbing"
          aria-label="Max price"
        />
      </Slider.Root>

      <div className="text-accent mb-4 flex justify-between text-sm uppercase">
        <p>
          <span aria-hidden="true">&gt;</span> min: {priceFilter.min}
        </p>
        <p>
          <span aria-hidden="true">&gt;</span> max: {priceFilter.max}
        </p>
      </div>
    </div>
  )
}
