import { TerminalInput } from '@/components/shared'
import { Button } from '@/components/ui'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <section className="flex justify-center">
      <form className="mt-16 flex w-full flex-col border p-6 uppercase md:my-36 md:w-150 md:p-10">
        <h1 className="mb-2 font-bold md:text-2xl">
          <span aria-hidden="true">[ Recover_Access_Key ]</span>
          <span className="sr-only">Forgot password</span>
        </h1>

        <p className="text-accent mb-8 text-sm wrap-break-word md:text-base">
          <span aria-hidden="true">
            <span className="mr-2">&gt;</span>
            <span>Provide_Operative_ID_for_reset_link</span>
          </span>
          <span className="sr-only">
            Provide your email address to receive a password reset link
          </span>
        </p>

        <div className="mb-8 flex flex-col gap-4">
          <TerminalInput
            type="email"
            name="email"
            placeholder="Operative_id (Email)"
            required={true}
            autoComplete="email"
            aria-label="Insert email for password recovery"
          />
        </div>

        <Button type="submit">
          <span aria-hidden="true">[ Transmit_Request ]</span>
          <span className="sr-only">Send password reset link</span>
        </Button>

        <p className="text-text-second mt-6 text-sm sm:text-center md:mt-8">
          <span aria-hidden="true">
            &gt; Authentication_recalled?{' '}
            <Link className="text-hover" href="/login">
              [ Return_to_login ]
            </Link>
          </span>
          <span className="sr-only">
            Remembered your password? Return to login page
          </span>
        </p>
      </form>
    </section>
  )
}
