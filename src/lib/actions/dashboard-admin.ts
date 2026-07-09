'use server'

import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ManageProductSchema } from '@/lib/zod/manage-product-schema'
import { Prisma } from '../../../generated/prisma'
import { revalidatePath } from 'next/cache'

type ProductDTO = z.infer<typeof ManageProductSchema>
// TODO: ADD chage category option
export const UpdateProduct = async (
  productId: string,
  data: ProductDTO,
): Promise<{ success: boolean; error?: string | string[] }> => {
  const session = await auth()

  const userId = session?.user.id

  const isAdmin = session?.user.role === 'admin'

  if (!userId || !isAdmin) {
    return { success: false, error: 'Unauthorized' }
  }

  const validatedData = ManageProductSchema.safeParse(data)

  if (!validatedData.success) {
    const errors = validatedData.error.issues.map((issue) => issue.message)

    return { success: false, error: errors }
  }

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: validatedData.data.name,
        slug: validatedData.data.slug,
        price: validatedData.data.price,
        quantity: validatedData.data.quantity,
        badge: validatedData.data.badge || null,
        technical: validatedData.data.technical,
        performance: validatedData.data.performance ?? Prisma.DbNull,
        specification: validatedData.data.specification,
      },
    })

    return { success: true }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ DATABASE_ERROR ]: Failed to update product', error)
    }
    return { success: false, error: 'Failed to update product' }
  }
}

export const DeleteProduct = async (
  productId: string,
): Promise<{ success: boolean; error?: string | string[] }> => {
  const session = await auth()

  const userId = session?.user.id

  const isAdmin = session?.user.role === 'admin'

  if (!userId || !isAdmin) {
    return { success: false, error: 'Unauthorized' }
  }

  if (!productId) {
    return { success: false, error: 'Missing productId' }
  }

  try {
    await prisma.product.delete({
      where: { id: productId },
    })

    revalidatePath('/dashboard/inventory')

    return { success: true }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ DATABASE_ERROR ]: Failed to delete product', error)
    }
    return { success: false, error: 'Failed to delete product' }
  }
}

export const AddProduct = async (
  data: ProductDTO,
): Promise<{
  success: boolean
  error?: string | string[]
}> => {
  const session = await auth()

  const userId = session?.user.id

  const isAdmin = session?.user.role === 'admin'

  if (!userId || !isAdmin) {
    return { success: false, error: 'Unauthorized' }
  }

  const validatedData = ManageProductSchema.safeParse(data)

  if (!validatedData.success) {
    const errors = validatedData.error.issues.map((issue) => issue.message)

    return { success: false, error: errors }
  }

  try {
    const category = await prisma.category.findFirst({
      where: { slug: validatedData.data.category },
      select: {
        id: true,
      },
    })

    if (!category) {
      return { success: false, error: 'Invalid category' }
    }

    await prisma.product.create({
      data: {
        name: validatedData.data.name,
        slug: validatedData.data.slug,
        price: validatedData.data.price,
        quantity: validatedData.data.quantity,
        badge: validatedData.data.badge || null,
        technical: validatedData.data.technical,
        performance: validatedData.data.performance ?? Prisma.DbNull,
        specification: validatedData.data.specification,
        category: {
          connect: {
            id: category.id,
          },
        },
      },
    })

    revalidatePath('/dashboard/inventory')

    return { success: true }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ DATABASE_ERROR ]: Failed to add product', error)
    }
    return { success: false, error: 'Failed to add product' }
  }
}
