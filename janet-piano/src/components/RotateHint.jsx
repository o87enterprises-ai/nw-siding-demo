import { useState } from 'react'

// Shown only on portrait phones (see .rotate-hint in index.css). Dismissal lasts for the visit.
export default function RotateHint() {
  const [hidden, setHidden] = useState(() => {
    try { return sessionStorage.getItem('janet-rotate-dismissed') === '1' } catch { return false }
  })
  if (hidden) return null
  const dismiss = () => {
    setHidden(true)
    try { sessionStorage.setItem('janet-rotate-dismissed', '1') } catch { /* ignore */ }
  }
  return (
    <div className="rotate-hint" role="note">
      <svg className="rotate-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="7" y="2.5" width="10" height="19" rx="2.2" />
        <path d="M11 18.5h2" />
      </svg>
      <span>Turn your phone sideways for a bigger piano</span>
      <button onClick={dismiss} aria-label="Dismiss">✕</button>
    </div>
  )
}
