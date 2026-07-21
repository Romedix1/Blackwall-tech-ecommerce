'use server'

import { prisma } from '@/lib/prisma'

export const generatePasswordResetToken = async (email: string) => {
  const newToken = crypto.randomUUID()

  const expires = new Date(new Date().getTime() + 60 * 60)

  await prisma.passwordResetToken.deleteMany({
    where: { identifier: email },
  })

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      identifier: email,
      token: newToken,
      expires: expires,
    },
  })

  return passwordResetToken
}
