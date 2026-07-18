'use client'

import { InformationModal, StatusAlert } from '@/components/shared'
import { Button } from '@/components/ui'
import { DeleteAccount } from '@/lib/actions/dashboard-user'
import { signOut, useSession } from 'next-auth/react'
import { useActionState, useEffect, useRef } from 'react'

type DeleteAccountModalProps = {
  onClose: () => void
}

export const DeleteAccountModal = ({ onClose }: DeleteAccountModalProps) => {
  const [state, formAction, isPending] = useActionState(DeleteAccount, null)

  const cancelBtnRef = useRef<HTMLButtonElement | null>(null)

  const { data: session } = useSession()
  const username = session?.user?.username

  useEffect(() => {
    if (state?.success) {
      signOut({ callbackUrl: '/' })
    }
  }, [state])

  useEffect(() => {
    cancelBtnRef.current?.focus()
  }, [])

  return (
    <InformationModal onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className="border-error-text/20 border-b pb-2">
          <h2 className="text-error-text text-lg font-bold tracking-tighter break-all uppercase">
            <span aria-hidden="true">[ ! ] Account_termination_protocol</span>
            <span className="sr-only">Warning: Account Deletion</span>
          </h2>
        </div>

        <div className="text-text-main flex flex-col gap-4 text-sm leading-relaxed tracking-tight uppercase">
          <p>
            <span className="text-error-text font-bold">Critical Alert:</span>{' '}
            You are about to initiate a complete system purge for this profile.
            This action is
            <span className="text-error-text font-bold"> irreversible </span>
            and will result in immediate data destruction.
          </p>

          <div className="bg-error-text/5 border-error-text/20 text-error-text flex flex-col gap-2 border p-3 text-xs">
            <p>&gt; ALL_PERSONAL_DATA: PENDING_PURGE</p>
            <p>&gt; ORDER_HISTORY: PENDING_PURGE</p>
            <p>&gt; ACTIVE_SESSIONS: TERMINATED</p>
            <p>&gt; TARGET_ENTITY: {username || 'Unknown user'}</p>
          </div>

          <p className="text-xs opacity-70">
            Proceeding will permanently erase your existence from the database.
          </p>
        </div>

        <form action={formAction}>
          <div className="text-text-main flex flex-col gap-2">
            {state?.error && <StatusAlert text={state.error} variant="error" />}
            {state?.success && (
              <StatusAlert
                text="Account purged successfully. Disconnecting..."
                variant="success"
              />
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              disabled={isPending}
              onClick={onClose}
              variant="secondary"
              ref={cancelBtnRef}
            >
              <span aria-hidden="true">[ Abort_purge ]</span>
              <span className="sr-only">Cancel procedure</span>
            </Button>

            <Button
              disabled={isPending || state?.success}
              type="submit"
              variant="delete"
              className="break-all"
            >
              <span aria-hidden="true">
                {isPending ? '[ Purging... ]' : '[ Confirm_purge ]'}
              </span>
              <span className="sr-only">
                {isPending ? 'Confirm deletion' : 'Deleting'}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </InformationModal>
  )
}
