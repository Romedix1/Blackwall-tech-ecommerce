import { ProductForm } from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/(product-management)/_components/product-form'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function AddProductPage() {
  const session = await auth()
  const user = session?.user

  if (!user || user.role !== 'admin') {
    redirect('/')
  }

  const categories = await prisma.category.findMany({
    select: {
      slug: true,
    },
  })

  const categoriesNames = categories.map((category) => category.slug)

  return (
    <div className="container mx-auto mt-8">
      <ProductForm
        mode="add"
        categories={categoriesNames}
        // initialData={product}
        // techKeyOptions={techKeyOptions}
        // techValueOptions={techValueOptions}
        // isGpuOrCpu={isGpuOrCpu}
        // specLabelOptions={specLabelOptions}
        // specKeyOptions={specKeyOptions}
        // specValueOptions={specValueOptions}
      />
    </div>
  )
}
