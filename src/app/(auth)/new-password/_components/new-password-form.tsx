'use client'

import { StatusAlert, TerminalInput } from '@/components/shared'
import { Button } from '@/components/ui'
import { ResetPassword } from '@/lib/actions'
import Link from 'next/link'
import { useActionState } from 'react'

type NewPasswordFormProps = {
  resetPasswordToken: string
}

export const NewPasswordForm = ({
  resetPasswordToken,
}: NewPasswordFormProps) => {
  const [state, formAction, isPending] = useActionState(ResetPassword, null)

  return (
    <form
      action={formAction}
      className="mt-16 flex w-full flex-col border p-6 uppercase md:my-36 md:w-150 md:p-10"
    >
      <h1 className="mb-2 font-bold md:text-2xl">
        <span aria-hidden="true">[ Initialize_New_Key ]</span>
        <span className="sr-only">Set new password</span>
      </h1>

      <p className="text-accent mb-8 text-sm wrap-break-word md:text-base">
        <span aria-hidden="true">
          <span className="mr-2 shrink-0">&gt;</span>
          <span>Enter_new_encryption_credentials</span>
        </span>
        <span className="sr-only">Enter and confirm your new password</span>
      </p>

      <div className="mb-8 flex flex-col gap-4">
        <input
          className="hidden"
          name="token"
          value={resetPasswordToken}
          readOnly
        />

        <TerminalInput
          type="password"
          name="password"
          placeholder="New_password"
          required={true}
          autoComplete="password"
          aria-label="Insert new password"
        />

        <TerminalInput
          type="password"
          name="confirmPassword"
          placeholder="Confirm_password"
          required={true}
          autoComplete="confirmPassword"
          aria-label="Confirm new password"
        />
      </div>

      <Button type="submit" disabled={isPending}>
        <span aria-hidden="true">
          [ {isPending ? 'Synchronizing...' : 'Update_Key'} ]
        </span>
        <span className="sr-only">
          {isPending ? 'Updating password...' : 'Set new password'}
        </span>
      </Button>

      <div className="mt-4 flex flex-col gap-2">
        {state?.success && (
          <StatusAlert variant="success" text={state.message} />
        )}
        {state?.error && <StatusAlert variant="error" text={state.error} />}
      </div>

      <p className="text-text-second mt-6 text-sm sm:text-center md:mt-8">
        <span aria-hidden="true">
          &gt; Abort_operation?{' '}
          <Link className="text-hover" href="/login">
            [ Return_to_login ]
          </Link>
        </span>
        <span className="sr-only">Cancel and return to login page</span>
      </p>
    </form>
  )
}
