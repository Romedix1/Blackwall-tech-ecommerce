import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { OrderStatus } from '../../../../../generated/prisma'
import { sendOrderSuccessEmail } from '@/lib/send-payment-success-email'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ WEBHOOK_ERROR ]', error)
    }

    return new NextResponse('Webhook error', { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded':
        await handleOrderUpdate(session, 'paid')
        break

      case 'payment_intent.payment_failed':
      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed':
        await handleOrderUpdate(session, 'failed')
        break

      default:
        return new NextResponse('Event ignored', { status: 200 })
    }

    return new NextResponse('Order updated', { status: 200 })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ WEBHOOK_PROCESSING_ERROR ]:', error)
    }

    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

async function handleOrderUpdate(
  session: Stripe.Checkout.Session,
  status: OrderStatus,
) {
  const { userId, orderId } = session.metadata || {}

  if (!userId || !orderId) {
    throw new Error('Missing metadata')
  }

  if (status === 'paid') {
    const orderWithItems = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'paid',
        stripeSessionId: session.id,
      },
      include: {
        items: true,
      },
    })

    const customerEmail = session.customer_details?.email
    const customerName = session.metadata?.fullName

    if (customerEmail && customerName) {
      try {
        await sendOrderSuccessEmail(customerEmail, customerName, orderWithItems)
        console.log(`[MAIL_SENT]: To ${customerEmail}`)
      } catch (emailError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[MAIL_ERROR]:', emailError)
        }
      }
    } else {
      return new NextResponse('Missing metadata', { status: 400 })
    }

    return orderWithItems
  }

  return await prisma.$transaction(async (trans) => {
    const order = await trans.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })

    if (!order) throw new Error('Order not found in database')

    if (order.status === 'pending') {
      for (const item of order.items) {
        await trans.product.update({
          where: { id: item.productId },
          data: { quantity: { increment: item.quantity } },
        })
      }
    }

    return await trans.order.update({
      where: { id: orderId },
      data: { status: 'failed' },
    })
  })
}
