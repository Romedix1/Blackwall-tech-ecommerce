'use server'

import { auth } from '@/auth'
import { getImageUrl } from '@/lib'
import { prisma } from '@/lib/prisma'

type CartItem = {
  slug: string
  quantity: number
}

export async function saveCartInDb(cart: CartItem[]) {
  const session = await auth()

  if (!session?.user.id) {
    return { error: 'Unauthorized' }
  }

  const userId = session.user.id

  try {
    await prisma.cart.upsert({
      where: { userId: userId },
      update: {
        items: {
          deleteMany: {},
          create: cart.map((item) => ({
            productSlug: item.slug,
            quantity: item.quantity || 1,
          })),
        },
      },
      create: {
        userId: userId,
        items: {
          create: cart.map((item) => ({
            productSlug: item.slug,
            quantity: item.quantity || 1,
          })),
        },
      },
    })

    return { success: true }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ CART_SAVING_ERROR ]:', error)
    }
  }
}

export async function fetchCartFromDb() {
  try {
    const session = await auth()

    if (!session) {
      return []
    }

    const userId = session.user.id

    const cart = await prisma.cart.findUnique({
      where: { userId: userId },
      select: {
        items: {
          select: {
            quantity: true,
            product: {
              select: {
                slug: true,
                name: true,
                price: true,
                category: {
                  select: {
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!cart || !cart.items.length) {
      return []
    }

    return await Promise.all(
      cart.items.map(async (item) => {
        const image = await getImageUrl(
          item.product.category.slug,
          item.product.slug,
        )

        return {
          slug: item.product.slug,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          imgSrc: image || '',
        }
      }),
    )
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ FETCH_CART_ERROR ]:', error)
    }
    return []
  }
}

export async function fetchProductsStock(slugs: string[]) {
  return await prisma.product.findMany({
    where: { slug: { in: slugs } },
    select: {
      slug: true,
      quantity: true,
    },
  })
}

export async function mergeCartWithDb(localCart: CartItem[]) {
  const session = await auth()

  if (!session?.user.id) {
    return { success: false, error: 'Unauthorized' }
  }

  const userId = session.user.id

  try {
    const existingCart = await prisma.cart.findUnique({
      where: { userId: userId },
      include: { items: true },
    })

    const mergedItemsMap = new Map<string, number>()

    if (existingCart) {
      existingCart.items.forEach((item) => {
        mergedItemsMap.set(item.productSlug, item.quantity)
      })
    }

    localCart.forEach((item) => {
      const currentQuantity = mergedItemsMap.get(item.slug) || 0
      mergedItemsMap.set(item.slug, currentQuantity + (item.quantity || 1))
    })

    const itemsToSave = Array.from(mergedItemsMap.entries()).map(
      ([slug, quantity]) => ({ slug, quantity }),
    )

    await prisma.cart.upsert({
      where: { userId: userId },
      update: {
        items: {
          deleteMany: {},
          create: itemsToSave.map((item) => ({
            productSlug: item.slug,
            quantity: item.quantity,
          })),
        },
      },
      create: {
        userId: userId,
        items: {
          create: itemsToSave.map((item) => ({
            productSlug: item.slug,
            quantity: item.quantity,
          })),
        },
      },
    })

    const fullyPopulatedCart = await fetchCartFromDb()

    return { success: true, cart: fullyPopulatedCart }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ CART_MERGING_ERROR ]:', error)
    }
    return { success: false, error: 'Failed to merge cart' }
  }
}
