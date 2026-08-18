import { AuthForm, AuthFormSkeleton } from '@/app/(auth)/_components'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Register',
}

export default async function RegisterPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <AuthForm mode="register" />
    </Suspense>
  )
}
