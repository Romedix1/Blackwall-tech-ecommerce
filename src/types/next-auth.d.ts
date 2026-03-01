import { DefaultSession, DefaultUser } from 'next-auth'
import { Role } from '../../generated/prisma'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username?: string | null
      role: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    username?: string | null
    role?: Role
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    username?: string | null
    role: Role
  }
}
