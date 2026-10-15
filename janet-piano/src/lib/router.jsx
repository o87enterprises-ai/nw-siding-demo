import { useEffect, useState } from 'react'

// Tiny History-API router: two pages, no dependency.
export function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const on = () => setPath(window.location.pathname)
    window.addEventListener('popstate', on)
    return () => window.removeEventListener('popstate', on)
  }, [])
  return path.replace(/\/+$/, '') || '/'
}

export function Link({ to, children, ...rest }) {
  const go = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    window.history.pushState({}, '', to)
    window.dispatchEvent(new PopStateEvent('popstate'))
    window.scrollTo(0, 0)
  }
  return <a href={to} onClick={go} {...rest}>{children}</a>
}
