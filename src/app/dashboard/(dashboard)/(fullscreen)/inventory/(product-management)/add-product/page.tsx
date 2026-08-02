import { BackButton } from '@/app/dashboard/(dashboard)/(fullscreen)/_components/back-button'
import { ProductForm } from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/(product-management)/_components/product-form'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function AddProductPage() {
  const session = await auth()
  const user = session?.user

  if (!user || !['admin', 'demoAdmin'].includes(user.role)) {
    redirect('/')
    return
  }

  const categories = await prisma.category.findMany({
    select: {
      slug: true,
    },
  })

  const categoriesNames = categories.map((category) => category.slug)

  return (
    <div className="container mx-auto mt-8">
      <BackButton link="/dashboard/inventory" />

      <ProductForm mode="add" categories={categoriesNames} />
    </div>
  )
}
