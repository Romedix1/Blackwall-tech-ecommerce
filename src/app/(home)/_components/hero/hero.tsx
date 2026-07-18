import {
  HeroActions,
  HeroContent,
  HeroImage,
} from '@/app/(home)/_components/hero'
import { auth } from '@/auth'
import { getImageUrl } from '@/lib'
import { prisma } from '@/lib/prisma'

export const Hero = async () => {
  const currrentProductId = 'b53030ca-0378-49e9-b5d7-37a0884cdbce'

  const currentProduct = await prisma.product.findUnique({
    where: { id: currrentProductId },
    select: {
      slug: true,
      name: true,
      price: true,
      quantity: true,
      category: { select: { slug: true } },
    },
  })

  const session = await auth()

  const isLoggedIn = !!session?.user?.id

  let productImage = null

  if (currentProduct) {
    productImage = await getImageUrl(
      currentProduct.category.slug,
      currentProduct.slug,
    )
  }

  return (
    <section className="container mx-auto mt-20 px-4 lg:mt-32">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-x-12 xl:gap-x-0">
        <div className="lg:col-start-1 lg:row-start-1">
          <HeroContent />
        </div>

        <div className="flex justify-center lg:col-start-2 lg:row-span-2">
          <HeroImage />
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          {currentProduct ? (
            <HeroActions
              product={currentProduct}
              isLoggedIn={isLoggedIn}
              productImg={productImage}
            />
          ) : (
            <div className="text-error-text border-error-text/20 bg-surface inline-block border p-3 text-sm font-bold tracking-tight uppercase">
              <span aria-hidden="true">
                [ ! ] Uplink_failed: Product_data_corrupted
              </span>
              <span className="sr-only">Error: product not found</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
