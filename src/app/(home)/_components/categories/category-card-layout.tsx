import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type CategoryCardLayoutProps = {
  index: string
  name: ReactNode
  productCountLabel: ReactNode
  image: ReactNode
  className?: string
}

export const CategoryCardLayout = ({
  index,
  name,
  productCountLabel,
  image,
  className,
}: CategoryCardLayoutProps) => {
  return (
    <div className={cn('flex h-full flex-col gap-8 p-5 md:flex-1', className)}>
      <div className="flex justify-between gap-4">
        <div className="flex flex-col xl:flex-row xl:gap-2">
          <div className="text-accent flex justify-between font-medium uppercase">
            <p className="text-xs xl:text-base">
              {index}
              <span aria-hidden="true">/</span>
            </p>
          </div>
          <h3 className="text-2xl font-bold uppercase xl:text-[32px]">
            {name}
          </h3>
        </div>

        <p className="text-accent text-right text-sm font-medium uppercase">
          <span aria-hidden="true">{'//'}</span> {productCountLabel}
        </p>
      </div>

      {image}
    </div>
  )
}
