'use client'

import {
  SettingsHeader,
  SettingsSection,
} from '@/app/dashboard/(dashboard)/(main)/settings/_components'
import { StatusAlert, TerminalInput } from '@/components/shared'
import { Button } from '@/components/ui'
import { changeUsername } from '@/lib/actions/dashboard-user'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

type UsernameSectionProps = {
  isDemo: boolean
}

export const UsernameSection = ({ isDemo }: UsernameSectionProps) => {
  const { update } = useSession()

  const router = useRouter()

  const [newUsername, setNewUsername] = useState('')
  const [feedback, setFeedback] = useState<{
    message: string
    success: boolean
  } | null>(null)

  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    const newUsername = formData.get('username') as string

    if (!newUsername) return

    setFeedback(null)

    startTransition(async () => {
      const result = await changeUsername(newUsername)

      if (result.success && result.newUsername) {
        await update({
          user: { username: result.newUsername },
        })

        router.refresh()
      }

      setFeedback({ message: result.message, success: result.success })
    })
  }

  return (
    <SettingsSection>
      <form action={handleSubmit}>
        <SettingsHeader>
          <span aria-hidden="true">[ Identity ]</span>
          <span className="sr-only">User nickname</span>
        </SettingsHeader>

        <div className="flex flex-col gap-4">
          <TerminalInput
            name="username"
            value={newUsername}
            required={true}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder={`Change_username`}
            aria-label={`Change username`}
            autoComplete="username"
          />

          <Button disabled={isDemo || isPending}>
            <span aria-hidden="true">
              {isPending ? '[ SYNCHRONIZING... ]' : '[ Change_Identity ]'}
            </span>
            <span className="sr-only">
              {isPending ? 'Changing username' : 'Change username'}
            </span>
          </Button>
        </div>

        {feedback && (
          <StatusAlert
            variant={feedback.success ? 'success' : 'error'}
            text={feedback.message}
          />
        )}
      </form>
    </SettingsSection>
  )
}
