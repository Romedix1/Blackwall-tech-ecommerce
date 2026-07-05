import { ProductForm } from '@/app/dashboard/(dashboard)/(fullscreen)/inventory/edit/_components/product-form'
import { auth } from '@/auth'
import { ProductNotFound } from '@/components/ui/product-not-found'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

type EditProductPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const resolvedParams = await params

  const productId = resolvedParams.id

  const session = await auth()
  const user = session?.user

  if (!user || user.role !== 'admin') {
    redirect('/')
  }

  const product = await prisma.product.findFirst({
    where: { id: productId },
    include: {
      category: true,
    },
  })

  if (!product) {
    return (
      <ProductNotFound
        href="/dashboard/inventory"
        buttonText={['Return to inventory', 'Return_to_list']}
      />
    )
  }

  const productsInCategory = await prisma.product.findMany({
    where: { categoryId: product.categoryId },
    select: { technical: true, specification: true },
  })

  const uniqueKeyOptions = new Set<string>()
  const uniqueValueOptions = new Set<string>()

  const uniqueSpecLabels = new Set<string>()
  const uniqueSpecKeys = new Set<string>()
  const uniqueSpecValues = new Set<string>()

  productsInCategory.forEach((product) => {
    if (
      product.technical &&
      typeof product.technical === 'object' &&
      !Array.isArray(product.technical)
    ) {
      Object.entries(product.technical).forEach(([key, value]) => {
        if (key && key.trim() !== '')
          uniqueKeyOptions.add(key.trim().toLowerCase())

        if (typeof value === 'string' && value.trim() !== '') {
          uniqueValueOptions.add(value.trim().toLowerCase())
        }

        if (Array.isArray(value)) {
          value.forEach((arrayItem) => {
            if (typeof arrayItem === 'string' && arrayItem.trim() !== '') {
              uniqueValueOptions.add(arrayItem.trim().toLowerCase())
            }
          })
        }
      })
    }

    const specs = product.specification as string

    if (Array.isArray(specs)) {
      specs.forEach((section) => {
        if (typeof section.label === 'string' && section.label.trim() !== '') {
          uniqueSpecLabels.add(section.label.trim().toLowerCase())
        }

        if (Array.isArray(section.attributes)) {
          section.attributes.forEach((attr: { key: string; value: string }) => {
            if (typeof attr.key === 'string' && attr.key.trim() !== '') {
              uniqueSpecKeys.add(attr.key.trim().toLowerCase())
            }
            if (typeof attr.value === 'string' && attr.value.trim() !== '') {
              uniqueSpecValues.add(attr.value.trim().toLowerCase())
            }
          })
        }
      })
    }
  })

  const techKeyOptions = Array.from(uniqueKeyOptions)
  const techValueOptions = Array.from(uniqueValueOptions)

  const specLabelOptions = Array.from(uniqueSpecLabels)
  const specKeyOptions = Array.from(uniqueSpecKeys)
  const specValueOptions = Array.from(uniqueSpecValues)

  techKeyOptions.push('Other')
  techValueOptions.push('Other')

  specLabelOptions.push('Other')
  specKeyOptions.push('Other')
  specValueOptions.push('Other')

  const isGpuOrCpu = ['gpu', 'cpu'].includes(product.category.slug)

  return (
    <form className="container mx-auto mt-8">
      <ProductForm
        initialData={product}
        techKeyOptions={techKeyOptions}
        techValueOptions={techValueOptions}
        isGpuOrCpu={isGpuOrCpu}
        specLabelOptions={specLabelOptions}
        specKeyOptions={specKeyOptions}
        specValueOptions={specValueOptions}
      />
    </form>
  )
}
