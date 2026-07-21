import { emailSchema } from '@/lib/zod/schemas'
import * as z from 'zod'

export const LoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'Empty password' }),
})
