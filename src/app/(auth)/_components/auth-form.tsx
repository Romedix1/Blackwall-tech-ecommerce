'use client'

import { RegisterSuccess } from '@/app/(auth)/register/_components/register-success'
import { signIn } from 'next-auth/react'
import { StatusAlert, TerminalInput } from '@/components/shared'
import { Button } from '@/components/ui'
import { LoginUser, RegisterUser, resendVerificationEmail } from '@/lib/actions'
import Link from 'next/link'
import { useActionState, useEffect, useRef, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { SiGmail } from 'react-icons/si'
import { useSearchParams } from 'next/navigation'
import { ResendEmailModal } from '@/app/(auth)/_components/resend-email-modal'

type AuthFormProps = {
  mode: 'login' | 'register'
}

const SOCIAL_PROVIDERS = [
  {
    id: 'github',
    name: 'Github',
    icon: FaGithub,
  },
  {
    id: 'google',
    name: 'Gmail',
    icon: SiGmail,
  },
]

export const AuthForm = ({ mode }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailNeeded, setIsEmailNeeded] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendResult, setResendStatus] = useState<{
    error?: string
    success?: string
  } | null>(null)

  const formRef = useRef<HTMLFormElement>(null)
  const hasMerged = useRef(false)

  const searchParams = useSearchParams()

  const isLogin = mode === 'login'

  const [state, formAction, isPending] = useActionState(
    isLogin ? LoginUser : RegisterUser,
    null,
  )

  const handleLogin = async (provider: string) => {
    setIsLoading(true)

    try {
      await signIn(provider, { redirectTo: '/' })
    } catch (error) {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (
      state?.success &&
      state?.message === 'User logged in' &&
      !hasMerged.current
    ) {
      hasMerged.current = true

      window.location.replace('/')
    }
  }, [state])

  const verificationEmail = state?.fields?.email

  if (state?.success && verificationEmail) {
    return <RegisterSuccess email={verificationEmail} />
  }

  const errorParam = searchParams.get('error') as string

  const loginErrorMap: { key: string; value: string }[] = [
    {
      key: 'token-expired',
      value: 'Uplink error: Session token expired. Please re-authenticate',
    },
    {
      key: 'missing-token',
      value: 'Protocol error: Clearance token missing from request',
    },
    {
      key: 'invalid-token',
      value: 'Uplink rejected: Invalid or corrupted clearance token',
    },
    {
      key: 'user-not-found',
      value: 'System error: Operative record not found in mainframe',
    },
    {
      key: 'protocol-failure',
      value: 'System failure: Unable to verify clearance protocol',
    },
    {
      key: 'session-expired',
      value: 'Uplink severed: Active session expired. Please log in again',
    },
  ]

  const matchedLoginError = loginErrorMap.find(
    (error) => error.key === errorParam,
  )

  const handleResend = async () => {
    const formData = formRef.current ? new FormData(formRef.current) : null
    const typedEmail = formData?.get('email') as string | null
    const email = typedEmail || state?.fields?.email

    if (email) {
      setIsResending(true)
      const result = await resendVerificationEmail(email)
      setResendStatus(result)
      setIsResending(false)
    } else {
      setIsEmailNeeded(true)
    }
  }

  return (
    <section className="flex justify-center">
      {isEmailNeeded && (
        <ResendEmailModal onClose={() => setIsEmailNeeded(false)} />
      )}
      <form
        ref={formRef}
        action={formAction}
        className="mt-16 flex w-full flex-col border p-6 uppercase md:my-36 md:w-150 md:p-10"
      >
        <h1 className="mb-2 font-bold md:text-2xl">
          <span aria-hidden="true">
            <span className="whitespace-nowrap">
              [ {isLogin ? 'Restricted_area' : 'Enlistment_protocol'} ]
            </span>{' '}
            {' // '}
            {isLogin ? 'Identification_required' : 'Create_new_record'}
          </span>
          <span className="sr-only">
            {isLogin
              ? 'Restricted area. identification required'
              : 'Create new account'}
          </span>
        </h1>
        <p className="text-accent text-sm wrap-break-word md:text-base">
          <span aria-hidden="true" className="flex items-start break-all">
            <span className="mr-2 shrink-0">&gt;</span>
            <span>
              {isLogin
                ? `Waiting_for_credentials`
                : ' Generating_new_encryption_keys...'}
            </span>
          </span>
          <span className="sr-only">
            {isLogin
              ? 'Waiting for credentials'
              : 'Generating new encryption keys'}
          </span>
        </p>

        <div className="my-8 flex flex-col gap-4">
          {!isLogin && (
            <TerminalInput
              defaultValue={state?.fields?.username || ''}
              placeholder="Assign_callsign"
              type="text"
              required={true}
              name="username"
              autoComplete="username"
              aria-label="Insert username"
            />
          )}
          <TerminalInput
            defaultValue={state?.fields?.email || ''}
            placeholder="Operative_id (Email)"
            required={true}
            type="email"
            name="email"
            autoComplete="email"
            aria-label="Insert email"
          />
          <TerminalInput
            defaultValue={state?.fields?.password || ''}
            placeholder="Access_code: ******"
            type="password"
            name="password"
            required={true}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            aria-label="Insert password"
          />
          {isLogin && (
            <Link
              href="/forgot-password"
              className="text-text-disabled text-hover self-end text-xs md:text-sm"
            >
              <span className="whitespace-nowrap" aria-hidden="true">
                [ Recover_access_key ]
              </span>
              <span className="sr-only">
                Forgot password? Recover access key
              </span>
            </Link>
          )}
          {!isLogin && (
            <TerminalInput
              defaultValue={state?.fields?.confirmPassword || ''}
              placeholder="Verify_encryption"
              type="password"
              name="confirmPassword"
              required={true}
              autoComplete="new-password"
              aria-label="Confirm password"
            />
          )}
        </div>
        <Button
          disabled={isPending}
          type="submit"
          aria-label={isLogin ? 'login' : 'register'}
        >
          <span aria-hidden="true">
            <span className="whitespace-nowrap">
              [{' '}
              {isPending
                ? 'Synchronizing... '
                : isLogin
                  ? 'Initiate_uplink'
                  : 'Generate_clearance'}{' '}
              ]
            </span>
          </span>
          <span className="sr-only">
            {isPending
              ? 'Processing request, please wait'
              : isLogin
                ? 'Log in to system'
                : 'Create account'}
          </span>
        </Button>

        <div className="mt-6 flex w-full gap-2">
          {SOCIAL_PROVIDERS.map((provider) => {
            const Icon = provider.icon
            return (
              <Button
                onClick={() => handleLogin(provider.id)}
                key={provider.id}
                disabled={isLoading}
                variant="secondary"
                type="button"
                className="border-border flex h-auto flex-1 flex-col items-center gap-1 py-4"
              >
                <Icon className="h-5 w-5 shrink-0" />
                <div>
                  <span aria-hidden="true">[ </span>
                  <span className="text-xs uppercase md:text-sm">
                    {provider.name}{' '}
                  </span>
                  <span aria-hidden="true"> ]</span>
                </div>
              </Button>
            )
          })}
        </div>

        {state?.error && <StatusAlert variant="error" text={state.error} />}

        {errorParam && errorParam !== 'token-expired' && (
          <div className="flex flex-col gap-3">
            <StatusAlert
              variant="error"
              text={matchedLoginError?.value || errorParam}
            />
          </div>
        )}

        {errorParam === 'token-expired' && (
          <div className="flex flex-col gap-3">
            {resendResult?.success ? (
              <StatusAlert variant="success" text={resendResult.success} />
            ) : (
              <StatusAlert
                variant="error"
                text={
                  resendResult?.error ||
                  'Uplink error: Session token expired. Please re-authenticate.'
                }
              />
            )}

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={handleResend}
              disabled={isResending}
            >
              <span aria-hidden="true">
                {isResending
                  ? '[ Transmitting... ]'
                  : '[ Request_new_clearance_token ]'}
              </span>
            </Button>
          </div>
        )}

        {state?.success && (
          <StatusAlert
            variant="success"
            text="Successfully logged in, redirecting..."
          />
        )}

        <p className="text-text-second mt-6 text-sm sm:text-center md:mt-8">
          <span aria-hidden="true">
            &gt; {isLogin ? 'No_clearance' : 'Already_have_clearance'}?{' '}
            <span className="inline-block whitespace-nowrap">
              <Link
                className="text-hover"
                href={isLogin ? '/register' : '/login'}
              >
                [ {isLogin ? 'Request_access' : 'Return_to_login'} ]
              </Link>
            </span>
          </span>
          <span className="sr-only">
            {isLogin
              ? 'No account? request access here'
              : 'Already have account? Return to login'}
          </span>
        </p>
      </form>
    </section>
  )
}
