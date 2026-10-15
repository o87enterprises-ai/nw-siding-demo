// Example pricing only. Replace with real values (or load from Stripe/Supabase).
export const SINGLE = [
  { id: 'single-30', title: 'Single Lesson', minutes: 30, price: 35, blurb: 'A focused check-in' },
  { id: 'single-60', title: 'Standard', minutes: 60, price: 60, blurb: 'The classic lesson', popular: true },
  { id: 'single-90', title: 'Premium', minutes: 90, price: 85, blurb: 'Deep-dive and repertoire' },
]
export const PLANS = [
  { id: 'plan-beginner', title: 'Beginner Program', detail: '4 lessons / month', price: 220 },
  { id: 'plan-growth', title: 'Growth Program', detail: '8 lessons / month', price: 400, popular: true },
  { id: 'plan-conservatory', title: 'Conservatory Track', detail: 'Weekly extended lessons', price: 650 },
]
export const money = (n) => `$${n.toLocaleString()}`
