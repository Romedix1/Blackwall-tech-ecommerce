import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { userId, resetPassword, resetAddress, resetUsername } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const updateData: Record<string, string | Date | null> = {}

    if (resetUsername === true) {
      updateData.username = 'testuser'
      updateData.usernameUpdatedAt = null
    }

    if (resetAddress === true) {
      updateData.shippingAddress = null
      updateData.city = null
      updateData.zipCode = null
      updateData.addressUpdatedAt = new Date('01-01-1950')
    }

    if (resetPassword === true) {
      updateData.password = await bcrypt.hash('TestBlackwallUser!1', 4)
      updateData.passwordChangedAt = null
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('E2E Reset Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
