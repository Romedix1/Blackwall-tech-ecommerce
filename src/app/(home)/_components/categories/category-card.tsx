import { CategoryCardLayout } from '@/app/(home)/_components/categories/category-card-layout'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ReactNode } from 'react'

type CategoryType = {
  name: string
  image: ReactNode
  productCount: number
}

type CategoriesCardProps = {
  index: number
  className?: string
  slug: string
  category: CategoryType
}

export const CategoryCard = ({
  index,
  className,
  slug,
  category,
}: CategoriesCardProps) => {
  return (
    <article className={cn(className)}>
      <Link
        href={`/products/${slug}`}
        className={cn(
          'border-accent/15 hover:border-accent focus:border-accent bg-surface group flex h-full cursor-pointer flex-col gap-8 overflow-hidden border p-5 outline-none md:flex-1',
        )}
      >
        <CategoryCardLayout
          index={`0${index}`}
          name={category.name}
          productCountLabel={
            <>
              {category.productCount}{' '}
              {category.productCount === 1 ? 'item' : 'items'}
            </>
          }
          image={category.image}
        />
      </Link>
    </article>
  )
}
