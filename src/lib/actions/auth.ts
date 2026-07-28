'use server'

import { prisma } from '@/lib/prisma'
import { emailSchema, RegisterSchema } from '@/lib/zod'
import bcrypt from 'bcryptjs'
import { signIn, signOut } from '@/auth'
import { LoginSchema } from '@/lib/zod'
import { AuthError } from 'next-auth'
import { FormState } from '@/types'
import { createLog } from '@/lib/logger'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { headers } from 'next/headers'
import { generateVerificationToken } from '@/lib/actions/generate-verification-token'
import { generatePasswordResetToken } from '@/lib/actions/generate-password-reset-token'
import { sendPasswordResetEmail } from '@/lib/mail/send-password-reset-email'
import { sendVerificationEmail } from '@/lib/mail/send-confirmation-email'
import { ResetPasswordSchema } from '@/lib/zod/reset-password-schema'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const loginRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
})

const registerRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, '15 m'),
})

const resendRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, '15 m'),
})

const passwordResetRequestRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, '15 m'),
})

const passwordResetRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
})

export const RegisterUser = async (
  prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  const rawData = Object.fromEntries(formData.entries()) as Record<
    string,
    string
  >

  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0] ??
    headersList.get('x-real-ip') ??
    '127.0.0.1'

  const { success: rateLimitSuccess } = await registerRateLimit.limit(
    `register_${ip}`,
  )

  if (!rateLimitSuccess) {
    return {
      error:
        'Uplink rejected: Too many registration attempts. Try again in 15 minutes.',
      fields: rawData,
    }
  }

  const validatedData = RegisterSchema.safeParse(rawData)

  if (!validatedData.success) {
    const errorArray = validatedData.error.issues.map((issue) => issue.message)
    return {
      error: errorArray,
      fields: rawData,
    }
  }

  const { username, email: rawEmail, password } = validatedData.data
  const email = rawEmail.toLowerCase()

  try {
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: { equals: username, mode: 'insensitive' } },
        ],
      },
    })

    if (userExists) {
      await createLog(
        'Register duplicate attempt',
        `Attempted to register with existing email or username: ${email}`,
      )

      return {
        error: 'User with this email or username already exists',
        fields: rawData,
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    })

    const verificationToken = await generateVerificationToken(email)

    try {
      await sendVerificationEmail(email, username, verificationToken.token)
    } catch (emailError) {
      await prisma.user.delete({
        where: { id: newUser.id },
      })

      if (process.env.NODE_ENV === 'development') {
        console.error('[ SMTP error ]:', emailError)
      }

      await createLog(
        'Register SMTP error',
        `Failed to send verification email to: ${email}`,
      )

      return {
        error:
          'Protocol error: Could not send verification email. Please try again',
        fields: rawData,
      }
    }

    await createLog(
      'User sign up',
      `Successfully signed up user: ${email}`,
      newUser.id,
    )

    return { success: true, message: 'Uplink initiated', fields: { email } }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ Registration error ]:', error)
    }

    return { error: 'Protocol error: Registration failed', fields: rawData }
  }
}

export const LoginUser = async (
  prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  const rawData = Object.fromEntries(formData.entries()) as Record<
    string,
    string
  >

  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0] ??
    headersList.get('x-real-ip') ??
    '127.0.0.1'

  const { success: rateLimitSuccess } = await loginRateLimit.limit(
    `login_${ip}`,
  )

  const validatedData = LoginSchema.safeParse(rawData)

  if (!rateLimitSuccess) {
    return {
      error:
        'Uplink rejected: Too many login attempts. Try again in 15 minutes',
      fields: rawData,
    }
  }

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues.map((issue) => issue.message),
      fields: rawData,
    }
  }

  const { email: rawEmail, password } = validatedData.data
  const email = rawEmail.toLowerCase()

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    await createLog(
      'User logged in',
      `Successfully logged in user: ${email}`,
      user?.id,
    )

    return { success: true, message: 'User logged in' }
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CallbackRouteError') {
        return {
          error: 'Protocol error: email not verified',
          fields: rawData,
        }
      }

      switch (error.type) {
        case 'CredentialsSignin':
          await createLog('Login failed', `Invalid credentials for: ${email}`)

          return {
            error: 'Access denied: invalid credentials',
            fields: rawData,
          }
        default:
          return {
            error: 'System failure: auth protocol error',
            fields: rawData,
          }
      }
    }

    throw error
  }
}

export const handleLogOut = async () => {
  await signOut({ redirectTo: '/login' })
}

export const resendVerificationEmail = async (email: string) => {
  const { success: rateLimitSuccess } = await resendRateLimit.limit(
    `resend_email_limit:${email}`,
  )

  if (!rateLimitSuccess) {
    return {
      error:
        'Uplink rejected: Too many resend attempts. Try again in 15 minutes',
    }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, username: true, emailVerified: true },
    })

    if (!user) {
      return { error: 'Operative ID not found.' }
    }

    if (user.emailVerified) {
      return { error: 'Clearance already granted. Please log in.' }
    }

    const verificationToken = await generateVerificationToken(email)

    await sendVerificationEmail(email, user.username, verificationToken.token)

    return { success: 'New clearance protocol sent to your inbox.' }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ Registration error ]:', error)
    }

    return { error: 'Protocol error: Resend failed', fields: email }
  }
}

export const RequestPasswordReset = async (
  prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  const rawEmail = formData.get('email') as string

  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0] ??
    headersList.get('x-real-ip') ??
    '127.0.0.1'

  const { success: rateLimitSuccess } =
    await passwordResetRequestRateLimit.limit(`request_email_${ip}`)

  if (!rateLimitSuccess) {
    return {
      error: 'Uplink rejected: Too many recovery requests. Try again later',
      fields: { email: rawEmail || '' },
    }
  }

  const validatedData = emailSchema.safeParse(rawEmail)

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues[0].message,
      fields: { email: rawEmail || '' },
    }
  }

  if (!rawEmail) {
    return { error: 'Protocol error: Operative ID (Email) is required.' }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.data },
      select: { username: true },
    })

    if (!existingUser) {
      return {
        success: true,
        message:
          'Request acknowledged. If an operative record exists, a secure link has been transmitted',
      }
    }

    const passwordResetToken = await generatePasswordResetToken(
      validatedData.data,
    )

    await sendPasswordResetEmail(
      validatedData.data,
      existingUser.username,
      passwordResetToken.token,
    )

    return {
      success: true,
      message:
        'Request acknowledged. If an operative record exists, a secure link has been transmitted',
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ Request password reset error ]:', error)
    }

    return {
      error: 'Protocol error: Registration failed',
      fields: { email: rawEmail },
    }
  }
}

export const ResetPassword = async (
  prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0] ??
    headersList.get('x-real-ip') ??
    '127.0.0.1'

  const { success: rateLimitSuccess } = await passwordResetRateLimit.limit(
    `reset_password_${ip}`,
  )

  const rawData = Object.fromEntries(formData.entries()) as Record<
    string,
    string
  >

  if (!rateLimitSuccess) {
    return {
      error:
        'Uplink rejected: Too many password reset attempts. Try again in 15 minutes',
      fields: rawData,
    }
  }

  const validatedData = ResetPasswordSchema.safeParse(rawData)

  if (!validatedData.success) {
    const errorArray = validatedData.error.issues.map((issue) => issue.message)
    return {
      error: errorArray,
      fields: rawData,
    }
  }

  const { token, password } = validatedData.data

  try {
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!existingToken || new Date() > existingToken.expires) {
      return {
        error: 'Protocol error: Invalid or expired token',
        fields: rawData,
      }
    }

    const user = await prisma.user.findUnique({
      where: { email: existingToken.identifier },
      select: { password: true, username: true, id: true },
    })

    if (!user || !user.password) {
      return {
        error: 'Protocol error: Operative record not found',
        fields: rawData,
      }
    }

    const isSamePassword = await bcrypt.compare(password, user.password)

    if (isSamePassword) {
      return {
        error:
          'Security alert: New encryption key must be different from the current one',
        fields: rawData,
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { email: existingToken.identifier },
      data: {
        password: hashedPassword,
      },
    })

    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    })

    await createLog(
      'Password reset',
      `Password updated successfully by ${user.username}`,
      user.id,
    )

    return {
      success: true,
      message:
        'Encryption key updated successfully. You may now initialize login',
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ Reset password error ]:', error)
    }

    return {
      error: 'System failure: Unable to synchronize new key at this time',
      fields: rawData,
    }
  }
}
