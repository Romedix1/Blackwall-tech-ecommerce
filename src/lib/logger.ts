import { prisma } from '@/lib/prisma'

export async function createLog(
  action: string,
  details?: string,
  userId?: string,
) {
  try {
    await prisma.systemLog.create({
      data: {
        action: action,
        userId: userId,
        details: details,
      },
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ SYSTEM_LOGGER_ERROR ]', error)
    }
  }
}
