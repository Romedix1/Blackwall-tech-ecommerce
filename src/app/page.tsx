import { Hero } from '@/app/(home)/_components/hero'
import { CategoriesSection } from '@/app/(home)/_components/categories/categories-section'

export default function Home() {
  return (
    <div className="flex flex-col gap-16 lg:gap-24">
      <Hero />
      <CategoriesSection />
    </div>
  )
}
