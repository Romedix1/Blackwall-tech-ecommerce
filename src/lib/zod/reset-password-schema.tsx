import {
  passwordMatchError,
  PasswordMatchschema,
  validatePasswords,
} from '@/lib/zod/schemas'
import * as z from 'zod'

export const ResetPasswordSchema = z
  .object({
    token: z.string(),
    ...PasswordMatchschema,
  })
  .refine(validatePasswords, passwordMatchError)
