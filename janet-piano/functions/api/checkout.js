// POST /api/checkout  ->  { url } for a Stripe Checkout Session.
// Cloudflare Pages Function. Needs the STRIPE_SECRET_KEY secret (see docs/BACKEND.md).
// Prices come from the shared catalog, never from the request body.
import { SINGLE, PLANS } from '../../src/lib/catalog.js'

const CATALOG = Object.fromEntries([...SINGLE, ...PLANS].map((p) => [p.id, p]))
const SLOT_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:00$/
const MAX_ITEMS = 10

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

// Stripe takes form-encoded bodies with bracketed keys for nesting.
function encode(obj, prefix = '', out = []) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}[${k}]` : k
    if (Array.isArray(v)) v.forEach((x, i) => (typeof x === 'object' ? encode(x, `${key}[${i}]`, out) : out.push([`${key}[${i}]`, x])))
    else if (v && typeof v === 'object') encode(v, key, out)
    else if (v !== undefined) out.push([key, v])
  }
  return out
}

export function buildSession(items, origin) {
  if (!Array.isArray(items) || items.length === 0) throw new Error('Your cart is empty.')
  if (items.length > MAX_ITEMS) throw new Error('Too many items in the cart.')

  const seen = new Set()
  const lines = []
  for (const { id, slot } of items) {
    const p = CATALOG[id]
    if (!p) throw new Error('Unknown item in cart.')
    const isPlan = id.startsWith('plan-')
    if (!isPlan && !SLOT_RE.test(slot || '')) throw new Error('Each lesson needs a time slot.')
    const key = `${id}@${slot || ''}`
    if (seen.has(key)) continue
    seen.add(key)
    lines.push({ p, isPlan, slot })
  }

  const plans = lines.filter((l) => l.isPlan)
  if (plans.length && plans.length !== lines.length) {
    throw new Error('Monthly programs and single lessons are billed separately. Please check out one at a time.')
  }
  const subscription = plans.length > 0

  return {
    mode: subscription ? 'subscription' : 'payment',
    line_items: lines.map(({ p, isPlan }) => ({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: p.price * 100,
        product_data: { name: p.title, description: p.detail || (p.minutes ? `${p.minutes}-minute piano lesson` : undefined) },
        ...(isPlan ? { recurring: { interval: 'month' } } : {}),
      },
    })),
    metadata: { items: lines.map((l) => (l.slot ? `${l.p.id}@${l.slot}` : l.p.id)).join(',').slice(0, 500) },
    success_url: `${origin}/?checkout=success`,
    cancel_url: `${origin}/book?checkout=cancelled`,
  }
}

export async function onRequestPost({ request, env }) {
  if (!env.STRIPE_SECRET_KEY) return json({ error: 'Payments are not configured yet.' }, 503)

  let body
  try { body = await request.json() } catch { return json({ error: 'Invalid request.' }, 400) }

  const origin = env.SITE_URL || new URL(request.url).origin
  let session
  try { session = buildSession(body?.items, origin) } catch (e) { return json({ error: e.message }, 400) }

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(encode(session)),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.url) {
    console.error('Stripe error', res.status, data?.error?.message)
    return json({ error: 'Could not start checkout. Please try again.' }, 502)
  }
  return json({ url: data.url })
}

export const onRequest = () => json({ error: 'Method not allowed.' }, 405)
