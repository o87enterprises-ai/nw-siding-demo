import Logo from './Logo'
import { Link, usePath } from '../lib/router'
import { usePlan } from '../lib/plan'

const LINKS = [
  ['/lessons', 'Lessons'],
  ['/live', 'Live'],
  ['/book', 'Book'],
  ['/plans', 'Plans'],
]

export default function SiteHeader() {
  const path = usePath()
  const { plan } = usePlan()
  return (
    <header className="site-header">
      <Link to="/" aria-label="Home"><Logo size={56} /></Link>
      <nav>
        {LINKS.map(([to, label]) => (
          <Link key={to} to={to} aria-current={path === to ? 'page' : undefined}>{label}</Link>
        ))}
        {plan !== 'none' && <span className="badge">{plan === 'premium' ? 'Premium' : 'Lessons'}</span>}
      </nav>
    </header>
  )
}
