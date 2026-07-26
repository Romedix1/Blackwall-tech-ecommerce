import { CategoriesContainer } from '@/app/(home)/_components/categories/categories-container'
import { CategoryCardSkeleton } from '@/app/(home)/_components/categories/category-card-skeleton'
import { Eyebrow } from '@/components/shared'
import { Suspense } from 'react'

export const CategoriesSection = () => {
  return (
    <section className="container mx-auto flex flex-col gap-8 sm:px-4">
      <Eyebrow>
        <span aria-hidden="true">{`//`} Categories_browser</span>
        <span className="sr-only">Categories browser</span>
      </Eyebrow>

      <Suspense fallback={<CategoryCardSkeleton />}>
        <CategoriesContainer />
      </Suspense>
    </section>
  )
}
