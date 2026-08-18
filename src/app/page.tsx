import { BestSellers } from '@/app/(home)/_components/best-sellers'
import { BuildPcSection } from '@/app/(home)/_components/build-pc'
import { CategoriesSection } from '@/app/(home)/_components/categories'
import { Hero } from '@/app/(home)/_components/hero'

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 overflow-x-hidden lg:gap-24">
      <Hero />
      <CategoriesSection />
      <BestSellers />
      <BuildPcSection />
    </div>
  )
}
