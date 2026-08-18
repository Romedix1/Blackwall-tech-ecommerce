import { AuthForm, AuthFormSkeleton } from '@/app/(auth)/_components'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Login',
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <AuthForm mode="login" />
    </Suspense>
  )
}
