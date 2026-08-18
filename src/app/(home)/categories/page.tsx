import { CategoriesContainer } from '@/app/(home)/_components/categories'
import { PathNavigator } from '@/components/shared'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products',
}

export default function CategoriesPage() {
  return (
    <div>
      <div className="container mx-auto mt-12">
        <PathNavigator />

        <header className="mt-4 mb-8">
          <h1 className="text-2xl font-extrabold tracking-tighter uppercase md:text-3xl lg:text-5xl">
            Hardware Archive
          </h1>
        </header>

        <CategoriesContainer />
      </div>
    </div>
  )
}
