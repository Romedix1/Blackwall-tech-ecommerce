'use client'

import { useDesktopMenu } from '@/hooks/use-desktop-menu'

type OpenDesktopMenuProps = {
  user: string
}

export const DesktopMenuButton = ({ user }: OpenDesktopMenuProps) => {
  const { toggle } = useDesktopMenu()

  return (
    <button className="max-w-36 truncate uppercase" onClick={toggle}>
      [ {user} ]
    </button>
  )
}
