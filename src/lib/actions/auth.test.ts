import { RequestPasswordReset, ResetPassword } from '@/lib/actions/auth'
import { prisma } from '@/lib/prisma'
import { FormState } from '@/types'
import bcrypt from 'bcryptjs'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    passwordResetToken: {
      delete: vi.fn(),
      create: vi.fn().mockResolvedValue({
        token: 'mock-token-123',
        expires: new Date(Date.now() + 60 * 60),
      }),
      findUnique: vi.fn(),
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

vi.mock('@/lib/actions/generate-password-reset-token', () => ({
  generatePasswordResetToken: vi.fn().mockResolvedValue({
    token: 'mock-token-123',
    expires: new Date(Date.now() + 60 * 60 * 1000),
  }),
}))

vi.mock('@/lib/mail/send-password-reset-email', () => ({
  sendPasswordResetEmail: vi.fn().mockResolvedValue(true),
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue('127.0.0.1'),
  }),
}))

vi.mock('@upstash/ratelimit', () => {
  return {
    Ratelimit: class {
      static slidingWindow() {
        return vi.fn()
      }
      async limit() {
        return { success: true }
      }
    },
  }
})

vi.mock('bcryptjs', () => {
  const compareMock = vi.fn()
  const hashMock = vi.fn()

  return {
    default: {
      compare: compareMock,
      hash: hashMock,
    },
    compare: compareMock,
    hash: hashMock,
  }
})

describe('Auth server actions', () => {
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

  describe('ResetPassword function', () => {
    const token = 'test-token'
    const password = 'testPassword123!'

    it('Should return error if token does not exist in database', async () => {
      const formData = new FormData()
      formData.append('token', token)
      formData.append('password', password)
      formData.append('confirmPassword', password)

      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(null)

      const result = await ResetPassword({} as FormState, formData)

      expect(result).toEqual({
        error: 'Protocol error: Invalid or expired token',
        fields: {
          token: token,
          password: password,
          confirmPassword: password,
        },
      })
    })

    it('Should return error if token is expired', async () => {
      const formData = new FormData()
      formData.append('token', token)
      formData.append('password', password)
      formData.append('confirmPassword', password)

      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue({
        id: 'test-id',
        identifier: 'test-email@gmail.com',
        token: token,
        expires: new Date('2025-07-10T08:00:00Z'),
        createdAt: new Date('2026-07-22T17:32:00Z'),
      })

      const result = await ResetPassword({} as FormState, formData)

      expect(result).toEqual({
        error: 'Protocol error: Invalid or expired token',
        fields: {
          token: token,
          password: password,
          confirmPassword: password,
        },
      })
    })

    it('Should return error if password is same as previous', async () => {
      const formData = new FormData()
      formData.append('token', token)
      formData.append('password', password)
      formData.append('confirmPassword', password)

      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue({
        id: 'test-id',
        identifier: 'test-email@gmail.com',
        token: token,
        expires: new Date('2027-07-10T08:00:00Z'),
        createdAt: new Date('2026-07-22T17:32:00Z'),
      })

      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        password: 'testPassword123',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      vi.mocked(bcrypt.compare).mockImplementation(async () => true)

      const result = await ResetPassword({} as FormState, formData)

      expect(result).toEqual({
        error:
          'Security alert: New encryption key must be different from the current one',
        fields: {
          token: token,
          password: password,
          confirmPassword: password,
        },
      })
    })

    it('Should return success when token is valid and password is changed', async () => {
      const formData = new FormData()
      formData.append('token', token)
      formData.append('password', password)
      formData.append('confirmPassword', password)

      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue({
        id: 'test-id',
        identifier: 'test-email@gmail.com',
        token: token,
        expires: new Date('2027-07-10T08:00:00Z'),
        createdAt: new Date('2026-07-22T17:32:00Z'),
      })

      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        password: 'oldPassword1!',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)

      vi.mocked(bcrypt.compare).mockImplementation(async () => false)

      vi.mocked(bcrypt.hash).mockImplementation(
        async () => 'hashedPassword1@#$',
      )

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(prisma.user.update).mockResolvedValue({} as any)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(prisma.passwordResetToken.delete).mockResolvedValue({} as any)

      const result = await ResetPassword({} as FormState, formData)

      expect(result).toEqual({
        success: true,
        message:
          'Encryption key updated successfully. You may now initialize login',
      })
    })
  })
})
