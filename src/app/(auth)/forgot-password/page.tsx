import { ForgotPasswordForm } from '@/app/(auth)/forgot-password/_components'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot password',
}

export default function ForgotPasswordPage() {
  return (
    <section className="flex justify-center">
      <ForgotPasswordForm />
    </section>
  )
}
