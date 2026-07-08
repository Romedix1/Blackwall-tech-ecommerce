'use server'

import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { EditProductSchema } from '@/lib/zod/edit-product-schema'
import { Prisma } from '../../../generated/prisma'

type UpdateProductDTO = z.infer<typeof EditProductSchema>

export const UpdateProduct = async (
  productId: string,
  data: UpdateProductDTO,
): Promise<{ success: boolean; error?: string | string[] }> => {
  const session = await auth()

  const userId = session?.user.id

  const isAdmin = session?.user.role === 'admin'

  if (!userId || !isAdmin) {
    return { success: false, error: 'Unauthorized' }
  }

  const validatedData = EditProductSchema.safeParse(data)

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
