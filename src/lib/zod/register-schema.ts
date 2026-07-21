import {
  emailSchema,
  passwordMatchError,
  PasswordMatchschema,
  UsernameField,
  validatePasswords,
} from '@/lib/zod/schemas'
import * as z from 'zod'

export const RegisterSchema = z
  .object({
    username: UsernameField,
    email: emailSchema,
    ...PasswordMatchschema,
  })
  .refine(validatePasswords, passwordMatchError)
