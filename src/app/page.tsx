import { Hero } from '@/app/(home)/_components/hero'
import { CategoriesSection } from '@/app/(home)/_components/categories'
import { BestSellers } from '@/app/(home)/_components/best-sellers'
import { BuildPcSection } from '@/app/(home)/_components/build-pc'

export default function Home() {
  return (
    <div className="flex flex-col gap-16 overflow-x-hidden lg:gap-24">
      <Hero />
      <CategoriesSection />
      <BestSellers />
      <BuildPcSection />
    </div>
  )
}
