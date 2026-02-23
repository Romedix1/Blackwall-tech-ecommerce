import { User2 } from 'lucide-react'

export const NavbarUserProfile = () => {
  return (
    <button className="terminal-hover relative flex items-center gap-2 px-2 py-1.5">
      <User2 />
      <span className="uppercase">[ sign in ]</span>
    </button>
  )
}
