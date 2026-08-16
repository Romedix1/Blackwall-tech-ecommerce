import { SpecificationList } from '@/app/(home)/product/[productName]/_components'
import { PerformanceBenchmarkContainer } from '@/app/(home)/product/[productName]/_components/performance-benchmark-container'
import { PerformanceBenchmarkSkeleton } from '@/app/(home)/product/[productName]/_components/performance-benchmark-skeleton'
import { ProductActions } from '@/app/(home)/product/[productName]/_components/product-actions'
import { PathNavigator } from '@/components/shared'
import { ImageNotFound, Separator } from '@/components/ui'
import { ImageCorner } from '@/components/ui/image-corner'
import { ProductNotFound } from '@/components/ui/product-not-found'
import { getImageUrl } from '@/lib'
import { prisma } from '@/lib/prisma'
import { SpecSection } from '@/types'
import Image from 'next/image'
import { Suspense } from 'react'

type ProductPageProps = {
  params: Promise<{ productName: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productName } = await params

  const product = await prisma.product.findUnique({
    where: { slug: productName },
    select: {
      slug: true,
      name: true,
      price: true,
      quantity: true,
      specification: true,
      performance: true,
      category: {
        select: {
          slug: true,
        },
      },
    },
  })

  if (!product) {
    return (
      <ProductNotFound href="/" buttonText={['Return to home', 'Return']} />
    )
  }

  const imageUrl = await getImageUrl(product.category.slug, product.slug)

  const showBenchmarks =
    product.performance && Array.isArray(product.performance)

  return (
    <div className="container mx-auto mt-16">
      <div className="lg:mb-24 lg:grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-16">
        <div className="col-start-2 mb-6 flex flex-col gap-2">
          <PathNavigator
            productCategory={product.category.slug}
            productName={product.slug}
          />
          <h1 className="text-2xl font-bold uppercase lg:text-4xl">
            {product.name}
          </h1>
        </div>

        <div className="bg-surface relative row-span-2 row-start-1 flex aspect-4/3 w-full items-center justify-center lg:aspect-auto">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              className="scale-80 object-contain xl:scale-90"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              fill
              priority
              loading="eager"
            />
          ) : (
            <ImageNotFound />
          )}

          <ImageCorner className="absolute top-0.5 left-0 z-30 rotate-90" />
          <ImageCorner className="absolute right-0 bottom-0.5 z-30 rotate-270" />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-accent text-2xl font-bold lg:text-3xl">
              $ {product.price.toFixed(2)}
            </h2>
            <p className="text-text-second text-xs uppercase lg:text-sm">
              {product.quantity > 0 ? (
                <>
                  <span aria-hidden="true">
                    [ in_stock_{product.quantity} ]
                  </span>
                  <span className="sr-only">in stock {product.quantity}</span>
                </>
              ) : (
                <>
                  <span aria-hidden="true">[ out_of_stock ]</span>
                  <span className="sr-only">out of stock</span>
                </>
              )}
            </p>
          </div>
          <Separator className="my-4 lg:my-8" />

          <ProductActions
            slug={product.slug}
            name={product.name}
            price={product.price}
            stock={product.quantity}
            imageUrl={imageUrl}
          />
        </div>
      </div>

      {product.specification && Array.isArray(product.specification) && (
        <SpecificationList
          specification={product.specification as SpecSection[]}
        />
      )}

      {showBenchmarks && (
        <Suspense fallback={<PerformanceBenchmarkSkeleton />}>
          <PerformanceBenchmarkContainer slug={product.slug} />
        </Suspense>
      )}
    </div>
  )
}
