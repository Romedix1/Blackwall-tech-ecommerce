import { NewPasswordForm } from '@/app/(auth)/new-password/_components'
import { Button } from '@/components/ui'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type ForgotPasswordPageProps = {
  searchParams: Promise<{ token: string }>
}

export default async function NewPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const resolvedSearchParams = await searchParams

  const token =
    typeof resolvedSearchParams.token === 'string'
      ? resolvedSearchParams.token
      : undefined

  if (!token) {
    redirect('/login')
    return
  }

  const dbToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  })

  if (!dbToken) {
    return (
      <section className="mt-16 flex justify-center md:my-36">
        <div className="border p-6 uppercase md:w-150 md:p-10">
          <h1 className="text-error-text mb-4 font-bold md:text-2xl">
            <span aria-hidden="true">[ Protocol_Error: Invalid_Token ]</span>
            <span className="sr-only">Invalid Token</span>
          </h1>

          <p className="text-accent mb-16 text-sm md:text-base">
            <span className="mr-2">&gt;</span>
            Clearance token is invalid or has expired.
          </p>

          <Button asChild className="flex items-center justify-center">
            <Link href="/forgot-password">[ Request_New_Key ]</Link>
          </Button>
        </div>
      </section>
    )
  }
  return (
    <section className="flex justify-center">
      <NewPasswordForm resetPasswordToken={token} />
    </section>
  )
}
