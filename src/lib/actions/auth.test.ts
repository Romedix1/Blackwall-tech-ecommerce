import { RequestPasswordReset } from '@/lib/actions/auth'
import { prisma } from '@/lib/prisma'
import { FormState } from '@/types'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    passwordResetToken: {
      deleteMany: vi.fn(),
      create: vi.fn().mockResolvedValue({
        token: 'mock-token-123',
        expires: new Date(Date.now() + 60 * 60),
      }),
    },
  },
}))

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn().mockReturnValue({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'mock-email' }),
    }),
  },
}))

describe('Auth', () => {
  describe('RequestPasswordReset function', () => {
    const email = 'testEmail@test.com'

    it('Should return success for nonexisting user email', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      const formData = new FormData()
      formData.append('email', email)

      const result = await RequestPasswordReset({} as FormState, formData)

      expect(result).toEqual({
        success: true,
        message:
          'Request acknowledged. If an operative record exists, a secure link has been transmitted',
      })
    })

    it('Should return success for existing user email', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        username: 'test-user',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      const formData = new FormData()
      formData.append('email', email)

      const result = await RequestPasswordReset({} as FormState, formData)

      expect(result).toEqual({
        success: true,
        message:
          'Request acknowledged. If an operative record exists, a secure link has been transmitted',
      })
    })
  })
})
