import Image from 'next/image'
import GraphicCard from '@public/best-sellers/graphic-card.png'
import { BackgroundGlow } from '@/components/ui'
import { cn } from '@/lib/utils'
import { BestSellersCard } from '@/app/(home)/_components/best-sellers'
import BestSellersProcessor from '@public/best-sellers/processor-ryzen.png'
import BestSellersMouse from '@public/best-sellers/mouse.png'
import BestSellersM2 from '@public/best-sellers/m2.png'

export const BestSellersContainer = () => {
  const BEST_SELLERS_CARDS = [
    {
      name: 'GeForce RTX 5090 TI',
      badge: (
        <>
          <span>
            <span aria-hidden="true">{'// '}</span>New
          </span>
        </>
      ),
      specs: ['24GB GDDR7X'],
      price: '1,999.00',
      image: (
        <div className="relative mb-8 rotate-8">
          <Image
            src={GraphicCard}
            alt="Graphic card GeForce RTX 5090 TI"
            className={cn(
              'relative z-20 mt-4 w-full scale-120 rotate-355 xl:w-225',
            )}
            width={1600}
            height={1200}
            sizes="(max-width: 1024px) 100vw, 1200px"
            priority
            quality={70}
          />
          <BackgroundGlow className="bg-accent/30 top-[70%] left-[50%] z-10 h-[80%] w-[70%] rotate-150 blur-2xl group-hover:scale-145 group-focus:scale-145 lg:h-full lg:w-full lg:blur-2xl" />
        </div>
      ),
    },
    {
      name: 'RYZEN 9 9950X EDITION',
      badge: (
        <>
          <span aria-hidden="true">{'// '}HOT_DEAL</span>
          <span className="sr-only">Hot deal</span>
        </>
      ),
      specs: ['16 cores', '32 threads', '5.7GHZ'],
      price: '649.00',
      image: (
        <div className="relative mb-8 rotate-8">
          <Image
            src={BestSellersProcessor}
            alt="Graphic card GeForce RTX 5090 TI"
            className={cn(
              'relative z-20 mt-4 w-full scale-120 rotate-355 xl:w-225',
            )}
            width={1600}
            height={1200}
            sizes="(max-width: 1024px) 100vw, 1200px"
            priority
            quality={70}
          />
          <BackgroundGlow className="bg-accent/30 top-[70%] left-[50%] z-10 h-[80%] w-[70%] rotate-150 blur-2xl group-hover:scale-145 group-focus:scale-145 lg:h-full lg:w-full lg:blur-2xl" />
        </div>
      ),
    },
    {
      name: 'Pro x wireless GEN 3',
      badge: (
        <>
          <span aria-hidden="true">{'// '}MOST_WANTED</span>
          <span className="sr-only">Most wanted</span>
        </>
      ),
      specs: ['32K DPI', '49G Weight', 'Lightspeed'],
      price: '159.00',
      image: (
        <div className="relative mb-8 rotate-8">
          <Image
            src={BestSellersMouse}
            alt="Mouse pro x wireless GEN 3"
            className={cn(
              'relative z-20 mt-4 w-full scale-120 rotate-355 xl:w-225',
            )}
            width={1600}
            height={1200}
            sizes="(max-width: 1024px) 100vw, 1200px"
            priority
            quality={80}
          />
          <BackgroundGlow className="bg-accent/30 top-[70%] left-[50%] z-10 h-[80%] w-[70%] rotate-150 blur-2xl group-hover:scale-145 group-focus:scale-145 lg:h-full lg:w-full lg:blur-2xl" />
        </div>
      ),
    },
    {
      name: 'M.2 NVME GEN 5 drive',
      badge: (
        <>
          <span aria-hidden="true">{'// '}FAST_TRACK</span>
          <span className="sr-only">Fast track</span>
        </>
      ),
      specs: ['4TB capacity', '14GB/s read'],
      price: '429.00',
      image: (
        <div className="relative mb-8 rotate-8">
          <Image
            src={BestSellersM2}
            alt="Disk M.2 NVME GEN 5 DRIVE"
            className={cn(
              'relative z-20 mt-4 w-full scale-120 rotate-355 xl:w-225',
            )}
            width={1600}
            height={1200}
            sizes="(max-width: 1024px) 100vw, 1200px"
            priority
            quality={80}
          />
          <BackgroundGlow className="bg-accent/30 top-[70%] left-[50%] z-10 h-[80%] w-[70%] rotate-150 blur-2xl group-hover:scale-145 group-focus:scale-145 lg:h-full lg:w-full lg:blur-2xl" />
        </div>
      ),
    },
  ]

  return (
    <div className="scrollbar-hide flex gap-3 overflow-x-scroll sm:gap-4">
      {BEST_SELLERS_CARDS.map((product, index) => {
        return (
          <BestSellersCard
            key={`best-sellers-card-${index}`}
            product={product}
          />
        )
      })}
    </div>
  )
}
