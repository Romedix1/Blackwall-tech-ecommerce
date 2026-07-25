import { auth } from '@/auth'
import { DesktopMenuButton } from '@/components/layout/navbar/desktop-menu-button'
import { User2 } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

const UserProfileData = async () => {
  const session = await auth()

  if (!session) {
    return (
      <Link
        href={'/login'}
        className="terminal-hover active:bg-primary-active relative flex cursor-pointer items-center gap-2 px-2 py-1.5"
      >
        <User2 />
        <span className="sr-only">sign in</span>
        <span aria-hidden="true">[ sign in ]</span>
      </Link>
    )
  }

  return <DesktopMenuButton user={session.user.username || 'Anonymous'} />
}

export const NavbarUserProfile = () => {
  return (
    <Suspense fallback={<div className="skeleton-loading h-6 w-36"></div>}>
      <UserProfileData />
    </Suspense>
  )
}
