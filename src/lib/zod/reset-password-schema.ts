import {
  passwordMatchError,
  PasswordMatchschema,
  validatePasswords,
} from '@/lib/zod/schemas'
import * as z from 'zod'

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Protocol error: Missing clearance token.'),
    ...PasswordMatchschema,
  })
  .refine(validatePasswords, passwordMatchError)
