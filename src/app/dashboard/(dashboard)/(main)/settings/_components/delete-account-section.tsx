'use client'

import { DeleteAccountModal } from '@/app/dashboard/(dashboard)/(main)/settings/_components/delete-account-modal'
import { Button } from '@/components/ui'
import { useState } from 'react'

export const DeleteAccountSection = () => {
  const [isDeleting, setIsDeleting] = useState(false)

  return (
    <section className="border-error-text/40 bg-error-bg/15 mt-10 border p-6 lg:col-span-2">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-error-text text-sm font-bold uppercase">
            <span aria-hidden="true">[ Critical_action: System_wipe ]</span>
            <span className="sr-only">Critial action: system wipe</span>
          </h2>
          <p className="text-error-text/70 mt-1 text-xs uppercase">
            Permanently delete all directives, logs, and identity records.
          </p>
        </div>
        <Button
          onClick={() => setIsDeleting(true)}
          className="text-sm"
          variant="delete"
        >
          <span aria-hidden="true">Initiate_Self_Destruct</span>
          <span className="sr-only">Delete account</span>
        </Button>
      </div>

      {isDeleting && (
        <DeleteAccountModal onClose={() => setIsDeleting(false)} />
      )}
    </section>
  )
}
