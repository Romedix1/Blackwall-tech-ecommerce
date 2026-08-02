'use client'

import {
  ChangePasswordModal,
  SettingsHeader,
  SettingsSection,
} from '@/app/dashboard/(dashboard)/(main)/settings/_components'
import { TerminateSessionsModal } from '@/app/dashboard/(dashboard)/(main)/settings/_components/terminate-sessions-modal'
import { Button } from '@/components/ui'
import { useState } from 'react'

type SecuritySectionProps = {
  isDemo: boolean
}

export const SecuritySection = ({ isDemo }: SecuritySectionProps) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isTerminatingSessions, setIsTerminatingSessions] = useState(false)

  return (
    <SettingsSection>
      <SettingsHeader>
        <span aria-hidden="true">[ Security_protocols ]</span>
        <span className="sr-only">Security protocols</span>
      </SettingsHeader>

      <div className="flex flex-col gap-4">
        <Button
          disabled={isDemo}
          onClick={() => setIsChangingPassword(true)}
          className="text-sm"
        >
          <span aria-hidden="true">&gt; Rotate_access_keys</span>
          <span className="sr-only">Change password</span>
        </Button>

        <Button
          disabled={isDemo}
          onClick={() => setIsTerminatingSessions(true)}
          variant="delete"
          className="px-4 text-sm"
        >
          <span aria-hidden="true" className="inline-block break-all">
            &gt; Terminate_all_remote_sessions
          </span>
          <span className="sr-only">Terminate all sessions</span>
        </Button>
      </div>

      {isChangingPassword && (
        <ChangePasswordModal onClose={() => setIsChangingPassword(false)} />
      )}
      {isTerminatingSessions && (
        <TerminateSessionsModal
          onClose={() => setIsTerminatingSessions(false)}
        />
      )}
    </SettingsSection>
  )
}
