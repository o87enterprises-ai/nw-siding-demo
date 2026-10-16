// Mock pricing for the preview. Replace with real values (or load from Stripe/Supabase).
// Live one-off sessions (pay per session, or included with Premium).
export const SINGLE = [
  { id: 'single-30', title: 'Live Session', minutes: 30, price: 35 },
  { id: 'single-60', title: 'Live Session', minutes: 60, price: 60, popular: true },
  { id: 'single-90', title: 'Live Session', minutes: 90, price: 85 },
]
// Monthly subscriptions. ids must start with "plan-" (the checkout function keys off that).
export const PLANS = [
  {
    id: 'plan-lessons',
    title: 'Lessons',
    detail: 'Interactive lessons · billed monthly',
    price: 19,
    perks: ['Full-screen piano', 'Light-up lessons', 'Every song'],
  },
  {
    id: 'plan-premium',
    title: 'Premium',
    detail: 'Live 1:1 with key match · billed monthly',
    price: 79,
    perks: ['Everything in Lessons', 'Live video above the piano', 'Key match'],
  },
]
export const money = (n) => `$${n.toLocaleString()}`
