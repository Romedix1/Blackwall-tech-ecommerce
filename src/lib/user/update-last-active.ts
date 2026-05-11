import { prisma } from '@/lib/prisma'

export async function updateLastActive(
  userId: string,
  lastActiveAt?: Date | null,
) {
  const now = new Date()
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

  if (lastActiveAt && lastActiveAt > fiveMinutesAgo) {
    return
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lastActiveAt: now },
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ LAST_ACTIVE_UPDATE_ERROR ]: ', error)
    }
  }
}
