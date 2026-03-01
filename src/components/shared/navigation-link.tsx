import { cn } from '@/lib/utils'
import Link from 'next/link'

type NavLinkType = {
  text: string
  href: string
}

export const NavLink = ({ text, href }: NavLinkType) => {
  return (
    <Link
      href={href}
      className={cn(
        'terminal-hover group active:bg-primary-active block px-2 py-1.5 uppercase outline-none',
      )}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        <span className="hidden group-hover:inline-block group-focus:inline-block">
          &gt;
        </span>{' '}
        [ {text} ]
      </span>
    </Link>
  )
}
