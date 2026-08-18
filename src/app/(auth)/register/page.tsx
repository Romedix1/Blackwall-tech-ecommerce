import { AuthForm, AuthFormSkeleton } from '@/app/(auth)/_components'
import { Suspense } from 'react'

export default async function RegisterPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <AuthForm mode="register" />
    </Suspense>
  )
}
