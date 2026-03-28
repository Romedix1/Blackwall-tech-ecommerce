import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      select: { status: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ status: order.status })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ STATUS_FETCH_ERROR ]: ', error)
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
