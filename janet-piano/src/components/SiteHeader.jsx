import Logo from './Logo'
import NavMenu from './NavMenu'
import { Link } from '../lib/router'

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link to="/" aria-label="Home"><Logo size={56} /></Link>
      <NavMenu />
    </header>
  )
}
