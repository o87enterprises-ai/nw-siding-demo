import { createContext, useContext, useEffect, useMemo, useState } from 'react'

// Mock entitlement: the demo checkout "unlocks" a plan in this browser only.
// Real access control belongs on the server (Stripe webhook -> Supabase).
const Ctx = createContext(null)
const KEY = 'janet-plan-v1'

export function PlanProvider({ children }) {
  const [plan, setPlan] = useState(() => {
    try { return localStorage.getItem(KEY) || 'none' } catch { return 'none' }
  })
  useEffect(() => {
    try { localStorage.setItem(KEY, plan) } catch { /* storage unavailable */ }
  }, [plan])
  const value = useMemo(() => ({
    plan,
    setPlan,
    hasLessons: plan === 'lessons' || plan === 'premium',
    isPremium: plan === 'premium',
  }), [plan])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const usePlan = () => useContext(Ctx)

export function planFromItems(items) {
  if (items.some((i) => i.id === 'plan-premium')) return 'premium'
  if (items.some((i) => i.id === 'plan-lessons')) return 'lessons'
  return null
}
