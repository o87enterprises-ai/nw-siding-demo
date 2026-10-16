import { useEffect, useRef, useState } from 'react'
import { Link, usePath } from '../lib/router'
import { usePlan } from '../lib/plan'

const ITEMS = [
  ['/', 'Home'],
  ['/sing', 'Practice'],
  ['/live', 'Live'],
  ['/book', 'Book'],
  ['/plans', 'Plans'],
]

// One small menu instead of a row of links.
export default function NavMenu({ className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const path = usePath()
  const { plan } = usePlan()

  useEffect(() => {
    if (!open) return
    const out = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const esc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', out)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', out); document.removeEventListener('keydown', esc) }
  }, [open])

  return (
    <div className={`navmenu ${className}`} ref={ref}>
      <button className="navmenu-btn" aria-haspopup="menu" aria-expanded={open} aria-label="Menu" onClick={() => setOpen((o) => !o)}>
        <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true"><path d="M1 1.5h16M1 7h16M1 12.5h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      </button>
      {open && (
        <div className="navmenu-list" role="menu">
          {ITEMS.map(([to, label]) => (
            <Link key={to} to={to} role="menuitem" aria-current={path === to ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          {plan !== 'none' && <span className="navmenu-plan">{plan === 'premium' ? 'Premium' : 'Lessons'}</span>}
        </div>
      )}
    </div>
  )
}
