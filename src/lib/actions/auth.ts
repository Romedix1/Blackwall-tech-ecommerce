'use server'

import { prisma } from '@/lib/prisma'
import { RegisterSchema } from '@/lib/zod'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from '@/lib/send-confirmation-email'
import { signIn, signOut } from '@/auth'
import { LoginSchema } from '@/lib/zod'
import { AuthError } from 'next-auth'
import { FormState } from '@/types'
import { createLog } from '@/lib/logger'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { headers } from 'next/headers'
import { generateToken } from '@/lib/actions/generate-token'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const loginRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
})

const resendRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, '15 m'),
})

export const RegisterUser = async (
  prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  const rawData = Object.fromEntries(formData.entries()) as Record<
    string,
    string
  >

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

    const verificationToken = await generateToken(email)

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

    const verificationToken = await generateToken(email)

    await sendVerificationEmail(email, user.username, verificationToken.token)

    return { success: 'New clearance protocol sent to your inbox.' }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ Registration error ]:', error)
    }

    return { error: 'Protocol error: Resend failed', fields: email }
  }
}
