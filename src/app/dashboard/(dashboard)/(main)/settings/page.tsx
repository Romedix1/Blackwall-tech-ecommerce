import {
  SecuritySection,
  UsernameSection,
  AddressSection,
  ActiveSessionsSkeleton,
  ActiveSessions,
  DeleteAccountSection,
} from '@/app/dashboard/(dashboard)/(main)/settings/_components'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/app/dashboard/_components/layout/header'

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
