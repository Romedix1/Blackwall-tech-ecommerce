'use server'

import { checkoutSchema } from '@/lib/zod'
import { FormState } from '@/types'
import { CartItem } from '../../../generated/prisma'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { auth } from '@/auth'
import Stripe from 'stripe'

export async function checkout(
  items: CartItem[],
  prevState: FormState,
  formData: FormData,
) {
  const rawData = Object.fromEntries(formData.entries()) as Record<
    string,
    string
  >

  const validatedData = checkoutSchema.safeParse(rawData)

  if (!validatedData.success) {
    const errorArray = validatedData.error.issues.map((issue) => issue.message)

    return { error: errorArray, fields: rawData }
  } else if (validatedData && validatedData.success) {
    const cookieStore = await cookies()

    cookieStore.set({
      name: 'blackwall_checkout_form',
      value: JSON.stringify(validatedData.data),
      maxAge: 60 * 10,
    })
  }

  let sessionUrl = ''
  let inventoryError = null

  try {
    const productSlugs = items.map((item) => item.productSlug)

    const dbProducts = await prisma.product.findMany({
      where: { slug: { in: productSlugs } },
    })

    const stripeLineitems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    for (const item of items) {
      const realProduct = dbProducts.find(
        (product) => product.slug === item.productSlug,
      )

      if (!realProduct) {
        inventoryError = `Uplink rejected: Product ${item.productSlug} not found`
        break
      } else if (item.quantity > realProduct.quantity) {
        inventoryError = `Uplink rejected: Insufficient stock for ${realProduct.name}`
        break
      }

      stripeLineitems.push({
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(realProduct.price * 100),
          product_data: {
            name: realProduct.name,
          },
        },
        quantity: item.quantity,
      })
    }

    if (inventoryError) {
      return { error: [inventoryError], fields: rawData }
    }

    const userSession = await auth()
    const userId = userSession?.user.id

    const totalAmount = items.reduce((sum, item) => {
      const product = dbProducts.find((p) => p.slug === item.productSlug)!
      return sum + product.price * item.quantity
    }, 0)

    const newOrder = await prisma.$transaction(async (trans) => {
      const createdOrder = await trans.order.create({
        data: {
          userId: userId || 'guest',
          email: validatedData.data.email,
          fullName: validatedData.data.fullName,
          phoneNumber: validatedData.data.phone,
          totalAmount: totalAmount,
          status: 'pending',
          address: validatedData.data.shippingAddress,
          city: validatedData.data.city,
          zipCode: validatedData.data.zipCode,
          items: {
            create: items.map((item) => {
              const product = dbProducts.find(
                (p) => p.slug === item.productSlug,
              )!
              return {
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
              }
            }),
          },
        },
      })

      for (const item of items) {
        const product = dbProducts.find((p) => p.slug === item.productSlug)!

        await trans.product.update({
          where: { id: product.id },
          data: { quantity: { decrement: item.quantity } },
        })
      }

      return createdOrder
    })

    // [ ARCHITECTURE NOTE FOR REVIEWERS ]
    // Stripe Tax (automatic_tax) is intentionally disabled in this portfolio project.
    // Enabling it requires configuring legal tax registrations and physical origin addresses
    // In a production environment, this would be handled via Stripe Tax API based on customer location.

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'us_bank_account'],
      mode: 'payment',
      currency: 'usd',
      line_items: stripeLineitems,
      customer_email: validatedData.data.email,
      metadata: {
        userId: userId || 'Guest',
        orderId: newOrder.id,
        email: validatedData.data.email,
        fullName: validatedData.data.fullName,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
    })

    if (!session.url) {
      throw new Error('Stripe failed to return a session URL')
    }

    sessionUrl = session.url
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(' [ STRIPE_PAYMENT_ERROR ]:', error)
    }
    return {
      error: ['Critical error: System data mismatch or connection failed'],
      fields: rawData,
    }
  }

  redirect(sessionUrl)
}
