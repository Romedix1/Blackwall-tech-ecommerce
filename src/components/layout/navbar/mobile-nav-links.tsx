import { LogOutButton, NavLink } from '@/components/shared'
import { Separator } from '@/components/ui'

const LINKS = [
  { text: 'My orders', href: '/dashboard/orders' },
  { text: 'Dashboard', href: '/dashboard' },
]

export const MobileNavLinks = () => {
  return (
    <div className="mt-2 flex w-full flex-col gap-2">
      {LINKS.map((link, index) => {
        return (
          <NavLink
            key={`mobile-link-${index}`}
            text={link.text}
            href={link.href}
          />
        )
      })}

      <Separator className="mb-3" />

      <LogOutButton />
    </div>
  )
}
