import { AuthForm, AuthFormSkeleton } from '@/app/(auth)/_components'
import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <AuthForm mode="login" />
    </Suspense>
  )
}
