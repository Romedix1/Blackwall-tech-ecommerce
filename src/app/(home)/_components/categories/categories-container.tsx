import { CategoryCard } from '@/app/(home)/_components/categories/category-card'
import { CATEGORY_UI_REGISTRY } from '@/app/(home)/_components/categories/category-ui-registry'
import { prisma } from '@/lib/prisma'

export const CategoriesContainer = async () => {
  const PRODUCT_ORDER = [
    'Graphics cards',
    'Peripherals',
    'Processors',
    'Memory',
  ]

  const categories = await prisma.category.findMany({
    where: {
      name: { in: PRODUCT_ORDER },
    },
    include: {
      _count: {
        select: { Product: true },
      },
    },
  })

  const orderedCategories = categories.sort((a, b) => {
    return PRODUCT_ORDER.indexOf(a.name) - PRODUCT_ORDER.indexOf(b.name)
  })

  return (
    <div className="flex flex-col gap-4 sm:gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {orderedCategories.map((category, index) => {
        const uiCategory = CATEGORY_UI_REGISTRY[category.slug]

        const categoryObject = {
          name: category.name,
          image: uiCategory.image,
          productCount: category._count.Product,
        }

        return (
          <CategoryCard
            className={uiCategory.className}
            key={`category-card-${index}`}
            slug={category.slug}
            index={index + 1}
            category={categoryObject}
          />
        )
      })}
    </div>
  )
}
