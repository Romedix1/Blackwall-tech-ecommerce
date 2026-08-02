import { DashboardHeader } from '@/app/dashboard/_components'
import {
  SecuritySection,
  UsernameSection,
  AddressSection,
} from '@/app/dashboard/(dashboard)/(main)/settings/_components'
import { ActiveSessions } from '@/app/dashboard/(dashboard)/(main)/settings/_components/active-sessions'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { DeleteAccountSection } from '@/app/dashboard/(dashboard)/(main)/settings/_components/delete-account-section'
import { Suspense } from 'react'
import { ActiveSessionsSkeleton } from '@/app/dashboard/(dashboard)/(main)/settings/_components/active-sessions-skeleton'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const session = await auth()
  const user = session?.user

  if (!session || !user) {
    redirect('/')
  }

  const userAddress = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      shippingAddress: true,
      zipCode: true,
      city: true,
    },
  })

  const fetchedUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { password: true },
  })

  const hasPassword = !!fetchedUser?.password

  const isDemo = user.role === 'demoAdmin'

  return (
    <>
      <DashboardHeader>
        <span aria-hidden="true">{'//'} User_settings_v1</span>
        <span className="sr-only">User settings</span>
      </DashboardHeader>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <UsernameSection isDemo={isDemo} />

        {hasPassword && <SecuritySection isDemo={isDemo} />}

        <AddressSection isDemo={isDemo} userAddress={userAddress} />

        {!isDemo && (
          <Suspense fallback={<ActiveSessionsSkeleton />}>
            <ActiveSessions />
          </Suspense>
        )}

        <DeleteAccountSection isDemo={isDemo} />
      </div>
    </>
  )
}
