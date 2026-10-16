// Posts the cart to /api/checkout (functions/api/checkout.js), which creates a
// Stripe Checkout Session and returns { url }. If the endpoint is missing or has
// no Stripe key (404/503) the site falls back to demo mode and charges nothing.
const ENDPOINT = import.meta.env.VITE_CHECKOUT_URL || '/api/checkout'

export async function startCheckout(items) {
  let res
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items.map(({ id, slot }) => ({ id, slot })) }),
    })
  } catch {
    return { demo: true }
  }
  if (res.status === 404 || res.status === 503) return { demo: true }
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.url) throw new Error(data.error || 'Checkout failed. Please try again.')
  window.location.assign(data.url)
  return { demo: false }
}
