import {
  ProductFilters,
  ProductSort,
} from '@/app/(home)/products/[productsCategory]/_components'
import { ProductItem } from '@/app/(home)/products/[productsCategory]/_components'
import { PathNavigator } from '@/components/shared'
import { Separator } from '@/components/ui'

type PageProps = {
  params: Promise<{ productsCategory: string }>
}

export default async function ProductsPage({ params }: PageProps) {
  const { productsCategory } = await params

  // const productCount = Math.floor(Math.random() * 100) + 1

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
                [ {2}_{2 * 2 === 1 ? 'record' : 'records'}
                _found ]
              </span>
            </span>

            <span className="sr-only">
              {productsCategory} division {2}{' '}
              {2 * 2 === 1 ? 'record' : 'records'} found
            </span>
          </h1>
        </header>

        <PathNavigator productCategory={productsCategory} />
      </div>

      <div className="my-4 flex items-center justify-between lg:hidden">
        <ProductFilters />
        <ProductSort />
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[260px_1fr] lg:gap-16">
        <aside className="hidden lg:block">
          <ProductFilters />
        </aside>

        <div className="flex flex-col gap-y-8">
          <div className="hidden lg:block">
            <ProductSort />
            <Separator />
          </div>

          <section className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-6">
            <ProductItem />
            <ProductItem />
            <ProductItem />
            <ProductItem />
          </section>
        </div>
      </div>
    </div>
  )
}
