'use server'

import { auth, signOut } from '@/auth'
import { checkUpdateCooldown } from '@/lib/check-update-cooldown'
import { createLog } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { addressSchema, UsernameField } from '@/lib/zod'
import { ResetPasswordSchema } from '@/lib/zod/reset-password-schema'
import { FormState } from '@/types'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

const UPDATE_COOLDOWN = 60 * 60 * 1000

export async function changeUsername(newUsername: string) {
  const session = await auth()
  const userId = session?.user.id

  if (!userId) {
    return { message: 'Unauthorized', success: false }
  }

  const validation = UsernameField.safeParse(newUsername)

  if (!validation.success) {
    return {
      message: validation.error.issues[0].message,
      success: false,
    }
  }

  const validatedUsername = validation.data.toLowerCase()

  try {
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: { equals: validatedUsername, mode: 'insensitive' },
        NOT: { id: userId },
      },
    })

    if (existingUsername) {
      return { message: 'Username already exists', success: false }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        usernameUpdatedAt: true,
      },
    })

    if (user?.usernameUpdatedAt) {
      const lastUpdated = user.usernameUpdatedAt.getTime()

      const canUpdate = checkUpdateCooldown(lastUpdated, UPDATE_COOLDOWN)

      if (!canUpdate.success) {
        await createLog(
          'Rate limit triggered',
          `User ${user.username} triggered system lock during username update`,
          userId,
        )

        return {
          message: `System lock: Wait ${canUpdate.remainingMin}m for next calibration`,
          success: false,
        }
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { username: validatedUsername, usernameUpdatedAt: new Date() },
    })

    await createLog(
      'Username updated',
      `Username updated from ${user?.username} to ${validatedUsername}`,
      session.user.id,
    )

    return {
      message: 'Identity recalibrated',
      success: true,
      newUsername: validatedUsername,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ CHANGE_USERNAME_ERROR ]:', error)
    }

    return {
      message: '[SYSTEM_FAILURE]: Unexpected database desync.',
      success: false,
    }
  }
}

export async function ResetPassword(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawData = Object.fromEntries(formData.entries()) as Record<
    string,
    string
  >

  const dataToValidate = {
    currentPassword: rawData.currentPassword,
    password: rawData.newPassword,
    confirmPassword: rawData.confirmNewPassword,
  }

  const validatedData = ResetPasswordSchema.safeParse(dataToValidate)

  if (!validatedData.success) {
    const errorArray = validatedData.error.issues.map((issue) => issue.message)
    return {
      error: errorArray,
      fields: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
    }
  }

  try {
    const session = await auth()
    const userId = session?.user.id

    if (!userId) {
      return {
        error: 'Unauthorized',
        fields: {
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        },
      }
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        password: true,
        passwordChangedAt: true,
      },
    })

    if (dbUser?.passwordChangedAt) {
      const lastUpdated = dbUser.passwordChangedAt.getTime()

      const canUpdate = checkUpdateCooldown(lastUpdated, UPDATE_COOLDOWN)

      if (!canUpdate.success) {
        await createLog(
          'Rate limit triggered',
          `User ${dbUser.username} triggered system lock during password reset`,
          userId,
        )

        return {
          error: `System lock: Wait ${canUpdate.remainingMin}m for next calibration`,
        }
      }
    }

    if (!dbUser?.password) {
      return {
        error: 'External accounts (OAuth) cannot modify passwords here',
        fields: {
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        },
      }
    }

    const passwordIsCorrect = await bcrypt.compare(
      validatedData.data.password,
      dbUser.password,
    )

    if (!passwordIsCorrect) {
      await createLog(
        'Password reset failed',
        `Failed password change attempt for user ${dbUser.username} - invalid current password`,
        userId,
      )

      return {
        error: 'Invalid current password',
        fields: {
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        },
      }
    }

    const hashedNewPassword = await bcrypt.hash(validatedData.data.password, 12)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword, passwordChangedAt: new Date() },
    })

    await createLog(
      'Password updated',
      `Password successfully updated for user ${dbUser.username}`,
      session.user.id,
    )

    return {
      success: true,
      message: 'Uplink initiated',
      fields: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      },
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ RESET_PASSWORD_ERROR ]:', error)
    }
    return {
      error: 'Protocol error: Password reset failed',
      fields: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      },
    }
  }
}

// export const isOAuthUser = async (): Promise<boolean> => {
//   const session = await auth()

//   const userId = session?.user.id

//   if (!userId) {
//     return false
//   }

//   try {
//     const account = await prisma.account.findFirst({
//       where: { userId },
//       select: { id: true },
//     })

//     return !!account
//   } catch (error) {
//     if (process.env.NODE_ENV === 'development') {
//       console.error('[ OAUTH_CHECK_FAILED ]: ', error)
//     }

//     return false
//   }
// }

export async function LogoutAllSessions() {
  const session = await auth()

  const userId = session?.user.id

  if (!userId) {
    return { error: 'Unauthorized' }
  }

  try {
    const result = await prisma.user.update({
      where: { id: userId },
      data: { tokenVersion: { increment: 1 } },
    })

    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: { username: true },
    })

    await prisma.activeConnection.deleteMany({
      where: { userId: userId },
    })

    await createLog(
      'Logged out all sessions',
      `Successfully logged out all sessions for user ${user?.username}`,
      session.user.id,
    )

    if (result) {
      await signOut({ redirectTo: '/login' })
    }

    return { success: true }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('[ GLOBAL_LOGOUT_ERROR ]:', error)
    }

    return { error: 'Protocol error: Failed to sever connections' }
  }
}

export async function ChangeAddress(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth()

  const userId = session?.user.id

  const rawData = Object.fromEntries(formData.entries()) as Record<
    string,
    string
  >

  if (!userId) {
    return { error: 'Unauthorized', fields: rawData }
  }

  const validatedData = addressSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      error: validatedData.error.issues.map((issue) => issue.message),
      fields: rawData,
    }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        addressUpdatedAt: true,
      },
    })

    if (user?.addressUpdatedAt) {
      const lastUpdated = user.addressUpdatedAt.getTime()

      const canUpdate = checkUpdateCooldown(lastUpdated, UPDATE_COOLDOWN)

      if (!canUpdate.success) {
        await createLog(
          'Rate limit triggered',
          `User ${user.username} triggered system lock during address update`,
          userId,
        )

        return {
          error: `System lock: Wait ${canUpdate.remainingMin}m for next calibration`,
        }
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        shippingAddress: validatedData.data.shippingAddress,
        city: validatedData.data.city,
        zipCode: validatedData.data.zipCode,
        addressUpdatedAt: new Date(),
      },
    })

    await createLog(
      'Address changed',
      `Successfully changed address to ${validatedData.data.shippingAddress}, ${validatedData.data.city}, ${validatedData.data.zipCode} for user ${user?.username}`,
      session.user.id,
    )

    revalidatePath('/', 'page')

    return { success: true, message: 'Address updated' }
  } catch (error) {
    if (process.env.NODE_ENV === 'development')
      console.error('[ ADDRESS_UPDATE_ERROR ]:', error)
    return { error: 'Protocol error: Database update failed', fields: rawData }
  }
}

export async function fetchAddress() {
  const session = await auth()

  const userId = session?.user.id

  if (!userId) {
    return { error: 'Unauthorized' }
  }

  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        shippingAddress: true,
        zipCode: true,
        city: true,
      },
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ FETCH_ADDRESS_ERROR ]:', error)
    }
    return null
  }
}

export async function TerminateSession(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const connectionId = formData.get('connectionId') as string

  const session = await auth()
  const userId = session?.user?.id

  if (!connectionId) {
    return { error: 'Unauthorized' }
  }

  try {
    const deletion = await prisma.activeConnection.deleteMany({
      where: {
        sessionToken: connectionId,
        userId: userId,
      },
    })

    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: { username: true },
    })

    if (deletion.count === 0) {
      return { error: 'Uplink not found or already terminated' }
    }

    await createLog(
      'Terminated session',
      `Successfully terminated session for user ${user?.username}`,
      userId,
    )

    revalidatePath('/dashboard/settings')

    return { success: true, message: 'Connection severed successfully' }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ TERMINATE_SESSION_ERROR ]:', error)
    }

    return { error: 'Critical failure: Could not sever uplink' }
  }
}

export async function DeleteAccount() {
  const session = await auth()

  const userId = session?.user.id

  if (!userId) {
    return { error: 'Unauthorized' }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true },
    })

    if (!user) {
      return { error: 'User not found' }
    }

    await createLog(
      'User deleted',
      `User ${user.username} deleted account`,
      userId,
    )

    await prisma.user.delete({
      where: { id: userId },
    })

    return { success: true, message: 'User account deleted' }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ DELETING_ACCOUNT_ERROR ]: ', error)
    }

    return { error: 'Critical failure: Could not delete user account' }
  }
}
