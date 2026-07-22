'use server'

import { prisma } from '@/lib/prisma'

export const generateVerificationToken = async (email: string) => {
  const newToken = crypto.randomUUID()

  const expires = new Date(new Date().getTime() + 3600 * 12000)

  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  })

  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: newToken,
      expires: expires,
    },
  })

  return verificationToken
}
