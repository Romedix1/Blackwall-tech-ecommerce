import { createLog } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    systemLog: {
      create: vi.fn(),
    },
  },
}))

describe('System logger', () => {
  it('Should correctly create log ', async () => {
    await createLog('User log in', 'Corretly logged in', 'user_123')

    expect(prisma.systemLog.create).toHaveBeenCalledTimes(1)
    expect(prisma.systemLog.create).toHaveBeenCalledWith({
      data: {
        action: 'User log in',
        details: 'Corretly logged in',
        userId: 'user_123',
      },
    })
  })

  it('Should handle undefined parameters', async () => {
    await createLog('User logged out', 'User logged out detailed', undefined)

    expect(prisma.systemLog.create).toHaveBeenCalledTimes(1)
    expect(prisma.systemLog.create).toHaveBeenCalledWith({
      data: {
        action: 'User logged out',
        details: 'User logged out detailed',
        userId: undefined,
      },
    })
  })

  it('Should silently fail if prisma throws an error', async () => {
    vi.stubEnv('NODE_ENV', 'development')

    vi.mocked(prisma.systemLog.create).mockRejectedValueOnce(
      new Error('Network error'),
    )

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await createLog('Deleted build', 'Build deleted', undefined)

    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
    vi.unstubAllEnvs()
  })
})
