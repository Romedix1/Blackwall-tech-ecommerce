'use client'

import { useEffect, useRef, useState } from 'react'
import {
  InformationModal,
  TerminalInput,
  StatusAlert,
} from '@/components/shared'
import { Button } from '@/components/ui'
import { resendVerificationEmail } from '@/lib/actions'

type ResendEmailModalProps = {
  onClose: () => void
}

export const ResendEmailModal = ({ onClose }: ResendEmailModalProps) => {
  const [email, setEmail] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [status, setStatus] = useState<{
    error?: string
    success?: string
  } | null>(null)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleResend = async (e: React.SubmitEvent) => {
    e.preventDefault()

    if (!email) return

    setIsPending(true)
    setStatus(null)

    const result = await resendVerificationEmail(email)

    setStatus(result)
    setIsPending(false)

    if (result?.success) {
      timeoutRef.current = setTimeout(onClose, 5000)
    }
  }

  return (
    <InformationModal
      onClose={onClose}
      aria-labelledby="resend-modal-title"
      aria-describedby="resend-modal-description"
    >
      <form onSubmit={handleResend} className="flex flex-col gap-6 py-4">
        <div className="border-accent/20 flex flex-col gap-2 border-b pb-2">
          <h2
            id="resend-modal-title"
            className="text-accent text-lg font-bold break-all lg:text-2xl"
          >
            <span aria-hidden="true" className="uppercase">
              [ Restore_Uplink_Connection ]
            </span>
            <span className="sr-only">Resend verification email</span>
          </h2>
        </div>

        <div
          id="resend-modal-description"
          className="flex flex-col gap-4 text-sm leading-relaxed lg:text-base"
        >
          <p>
            <span className="text-accent font-bold" aria-hidden="true">
              &gt; Authorization_required:
            </span>{' '}
            Session expired or clearance not granted.
          </p>
          <p className="text-text-second">
            Provide your registered Operative ID (Email) below. The mainframe
            will generate a new clearance token and transmit it to your inbox.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <TerminalInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Operative_id (Email)"
            required={true}
            type="email"
            name="email"
            autoComplete="email"
            aria-label="Insert email to resend token"
          />

          {status?.success && (
            <StatusAlert variant="success" text={status.success} />
          )}
          {status?.error && <StatusAlert variant="error" text={status.error} />}
        </div>

        <div className="mt-2 flex flex-col gap-3 text-sm sm:flex-row-reverse sm:text-base">
          <Button
            type="submit"
            disabled={isPending || !email}
            className="flex items-center justify-center"
          >
            <span aria-hidden="true">
              {isPending ? '[ Transmitting... ]' : '[ Request_Token ]'}
            </span>
            <span className="sr-only">
              {isPending ? 'Sending email' : 'Request new token'}
            </span>
          </Button>

          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={isPending}
            aria-label="Cancel and close modal"
          >
            <span aria-hidden="true" className="uppercase">
              [ Cancel_Operation ]
            </span>
            <span className="sr-only">Cancel and close</span>
          </Button>
        </div>
      </form>
    </InformationModal>
  )
}
