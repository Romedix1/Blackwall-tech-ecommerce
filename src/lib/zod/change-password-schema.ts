import {
  passwordMatchError,
  PasswordMatchschema,
  validatePasswords,
} from '@/lib/zod/schemas'
import * as z from 'zod'

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    ...PasswordMatchschema,
  })
  .refine(validatePasswords, passwordMatchError)
