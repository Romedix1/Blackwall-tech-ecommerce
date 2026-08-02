import { auth } from '@/auth'
import { LogOutButton, NavigationLinks } from '@/components/shared'
import { cn } from '@/lib'
import { redirect } from 'next/navigation'

export const DashboardNav = async () => {
  const session = await auth()
  const userRole = session?.user.role

  if (!userRole) {
    redirect('/')
    return
  }

  const isAdmin = ['admin', 'demoAdmin'].includes(userRole)
  const header = isAdmin
    ? 'root@system:~# OVERRIDE_CONTROLS'
    : '// TERMINAL_ACCESS'
  const headerSr = isAdmin ? 'Admin override controls' : 'Terminal access'

  const ADMIN_LINKS = [
    { href: '/dashboard', label: '[ System_metrics ]', sr: 'System metrics' },
    {
      href: '/dashboard/inventory',
      label: '[ Inventory_db ]',
      sr: 'Database inventory',
    },
    {
      href: '/dashboard/directives',
      label: '[ Directive_queue ]',
      sr: 'Directive queue',
    },
    {
      href: '/dashboard/operatives',
      label: '[ Operative_records ]',
      sr: 'Operative records',
    },
    {
      href: '/dashboard/logs',
      label: '[ SYSTEM_LOGS ]',
      sr: 'System activity logs',
    },
  ]

  const USER_LINKS = [
    { href: '/dashboard', label: '[ Status_report ]', sr: 'Status report' },
    {
      href: '/dashboard/history',
      label: '[ Order_history ]',
      sr: 'Order history',
    },
    {
      href: '/dashboard/builds',
      label: '[ Saved_builds ]',
      sr: 'Saved builds',
    },
    { href: '/dashboard/settings', label: '[ Settings ]', sr: 'Settings' },
  ]

  const links = isAdmin
    ? [
        ...ADMIN_LINKS,
        ...USER_LINKS.filter((link) => link.href !== '/dashboard'),
      ]
    : USER_LINKS

  return (
    <nav
      aria-label="Dashboard sidebar"
      className="mb-8 w-full max-w-full overflow-hidden"
    >
      <>
        <h2
          className={cn(
            'text-text-second mb-6 text-sm font-bold wrap-break-word uppercase lg:w-11/12 lg:text-base xl:w-full 2xl:text-xl',
            userRole === 'admin' && 'text-warning',
          )}
        >
          <span aria-hidden="true">{header}</span>
          <span className="sr-only">{headerSr}</span>
        </h2>

        <div className="relative w-full min-w-0">
          <NavigationLinks links={links} />
        </div>

        <div className="mt-16 hidden lg:block">
          <LogOutButton
            isAdmin={isAdmin}
            className="px-0 text-sm 2xl:text-base"
          />
        </div>
      </>
    </nav>
  )
}
