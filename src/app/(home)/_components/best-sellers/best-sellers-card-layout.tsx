import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type BestSellersCardLayoutProps = {
  image: ReactNode
  badge: ReactNode
  name: ReactNode
  specs: ReactNode
  price: ReactNode
  action: ReactNode
  className?: string
}

export const BestSellersCardLayout = ({
  image,
  badge,
  name,
  specs,
  price,
  action,
  className,
}: BestSellersCardLayoutProps) => {
  return (
    <div
      className={cn(
        'flex h-full w-full min-w-0 flex-col p-6 xl:w-auto xl:flex-1',
        className,
      )}
    >
      <div>
        <div className="relative mb-8 flex h-48 w-full items-center justify-center lg:h-56">
          {image}
        </div>

        <p className="text-accent mb-2 text-[11px] font-medium uppercase lg:text-sm">
          <span className="mr-2" aria-hidden="true">
            {'//'}
          </span>
          {badge}
        </p>
        <h3 className="mb-1 text-xl font-bold uppercase lg:text-2xl">{name}</h3>

        <ul className="text-text-second my-4 flex flex-wrap text-[11px] font-medium uppercase lg:text-xs">
          {specs}
        </ul>
      </div>

      <div className="mt-auto">
        <p className="text-accent mb-8 text-xl font-medium lg:text-2xl">
          {price}
        </p>

        {action}
      </div>
    </div>
  )
}
