import { BackgroundGlow, Button } from '@/components/ui'
import Image from 'next/image'
import img from '@public/hero/graphic-card.png'

export const ProductItem = () => {
  return (
    <article className="flex flex-col gap-6 border p-4">
      <div className="relative">
        <Image
          alt="Product image"
          src={img}
          className="relative z-20"
          width={300}
          height={300}
        />
        <BackgroundGlow className="top-[60%] h-24 w-24 blur-[30px]" />
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="font-bold uppercase">Asus rog rtx 5090</h2>
        <p className="text-accent font-bold">$ 1,999.00</p>
      </div>
      <Button variant="primary">
        <span aria-hidden="true">[</span>
        <span aria-hidden="true">Add_to_cart</span>
        <span className="sr-only">Add to cart</span>
        <span aria-hidden="true">]</span>
      </Button>
    </article>
  )
}
