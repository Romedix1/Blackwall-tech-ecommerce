import {
  ProductFilters,
  ProductSort,
} from '@/app/(home)/products/[productsCategory]/_components'
import { ProductItem } from '@/app/(home)/products/[productsCategory]/_components'
import { PathNavigator } from '@/components/shared'
import { Separator } from '@/components/ui'
import { prisma } from '@/lib/prisma'

type PageProps = {
  params: Promise<{ productsCategory: string }>
}

type AttributeType = {
  key: string
  value: string
}

type SpecSection = {
  label: string
  attributes: AttributeType[]
}

type ProductSpecification = SpecSection[]

export default async function ProductsPage({ params }: PageProps) {
  const { productsCategory } = await params

  const category = await prisma.category.findUnique({
    where: { slug: productsCategory },
  })

  if (!category) return null

  const categoryProductsCount = await prisma.product.count({
    where: { categoryId: category.id },
  })

  const productsData = await prisma.product.findMany({
    where: { categoryId: category.id },
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      specification: true,
    },
  })

  const productFilters = new Map<string, Set<string>>()

  productsData.forEach((product) => {
    const specs = product.specification as ProductSpecification
    if (!specs) return

    specs.forEach((section) => {
      section.attributes.forEach((attribute: AttributeType) => {
        if (!productFilters.has(attribute.key)) {
          productFilters.set(attribute.key, new Set())
        }

        productFilters.get(attribute.key)!.add(attribute.value)
      })
    })
  })

  const filtersData = Array.from(productFilters.entries()).map(
    ([key, valuesSet]) => ({
      key,
      values: Array.from(valuesSet),
    }),
  )

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col gap-y-2 sm:flex-row sm:justify-between lg:mb-16">
        <header className="w-full">
          <h1 className="flex flex-col uppercase">
            <span
              aria-hidden="true"
              className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:gap-x-3"
            >
              <span className="text-2xl leading-none font-bold lg:text-3xl">
                {productsCategory}_division
              </span>

              <span className="inline-block text-xs whitespace-nowrap sm:text-base lg:text-2xl">
                [ {categoryProductsCount}_
                {categoryProductsCount === 1 ? 'record' : 'records'}
                _found ]
              </span>
            </span>

            <span className="sr-only">
              {productsCategory} division {2}{' '}
              {categoryProductsCount === 1 ? 'record' : 'records'} found
            </span>
          </h1>
        </header>

        <PathNavigator productCategory={productsCategory} />
      </div>

      <div className="my-4 flex items-center justify-between lg:hidden">
        <ProductFilters filtersData={filtersData} />
        <ProductSort />
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[260px_1fr] lg:gap-16">
        <aside className="hidden lg:block">
          <ProductFilters filtersData={filtersData} />
        </aside>

        <div className="flex flex-col gap-y-8">
          <div className="hidden lg:block">
            <ProductSort />
            <Separator />
          </div>

          <section className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-6">
            {productsData.map((product) => {
              return (
                <ProductItem
                  key={product.id}
                  product={product}
                  category={category.slug}
                />
              )
            })}
          </section>
        </div>
      </div>
    </div>
  )
}
