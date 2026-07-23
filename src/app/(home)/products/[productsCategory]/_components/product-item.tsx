import { ProductImage } from '@/app/(home)/products/[productsCategory]/_components/product-image'
import { AddToCartButton } from '@/components/shared/add-to-cart-button'
import { BackgroundGlow } from '@/components/ui'
import { getImageUrl } from '@/lib'
import Link from 'next/link'

type productType = {
  id: string
  slug: string
  name: string
  price: number
}

type ProductItemProps = {
  product: productType
  category: string
}

export const ProductItem = async ({ product, category }: ProductItemProps) => {
  const imageUrl = await getImageUrl(category, product.slug)

  const cartProduct = {
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: imageUrl,
  }

  return (
    <article>
      <Link
        href={`/product/${product.slug}`}
        className="group hover:border-accent focus:border-accent flex h-full flex-col gap-6 border p-4 outline-none"
      >
        <div className="relative flex aspect-4/3 flex-col items-center justify-center">
          <ProductImage src={imageUrl} alt={product.name} />

          <BackgroundGlow className="top-[60%] h-24 w-24 blur-[30px] group-hover:scale-200" />
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <h2 className="font-bold uppercase" title={product.name}>
            {product.name}
          </h2>
          <p className="text-accent font-bold">$ {product.price.toFixed(2)}</p>
        </div>

        <AddToCartButton product={{ ...cartProduct, stock: 1 }} />
      </Link>
    </article>
  )
}
