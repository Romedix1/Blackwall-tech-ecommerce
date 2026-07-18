import { DashboardHeader } from '@/app/dashboard/_components'
import {
  SecuritySection,
  UsernameSection,
  AddressSection,
} from '@/app/dashboard/(dashboard)/(main)/settings/_components'
import { ActiveSessions } from '@/app/dashboard/(dashboard)/(main)/settings/_components/active-sessions'
import { auth } from '@/auth'
import { isOAuthUser } from '@/lib/actions/dashboard-user'
import { prisma } from '@/lib/prisma'
import { DeleteAccountSection } from '@/app/dashboard/(dashboard)/(main)/settings/_components/delete-account-section'

export default async function SettingsPage() {
  const isOAuth = await isOAuthUser()

  const session = await auth()
  const userId = session?.user.id

  const userAddress = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      shippingAddress: true,
      zipCode: true,
      city: true,
    },
  })

  return (
    <>
      <DashboardHeader>
        <span aria-hidden="true">{'//'} User_settings_v1</span>
        <span className="sr-only">User settings</span>
      </DashboardHeader>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <UsernameSection />

        {!isOAuth && <SecuritySection />}

        <AddressSection userAddress={userAddress} />

        <ActiveSessions />

        {/* TODO: ADD DELETE ACCOUNT OPTION */}
        <DeleteAccountSection />
      </div>
    </>
  )
}
