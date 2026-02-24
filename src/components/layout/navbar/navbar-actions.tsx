import { NavbarCart } from '@/components/layout/navbar/navbar-cart'
import { NavbarHamburgerMenu } from '@/components/layout/navbar/navbar-hamburger-menu'
import { NavbarUserProfile } from '@/components/layout/navbar/navbar-user-profile'

export const NavbarActions = () => {
  return (
    <div className="flex items-center gap-3">
      <NavbarCart />
      <span className="lg:hidden">
        <NavbarHamburgerMenu />
      </span>
      <span className="hidden lg:block">
        <NavbarUserProfile />
      </span>
    </div>
  )
}
