// Posts the cart to a server endpoint that creates a Stripe Checkout Session
// (see docs/BACKEND.md) and returns { url }. Without VITE_CHECKOUT_URL the site
// runs in demo mode and nothing is charged.
export async function startCheckout(items) {
  const endpoint = import.meta.env.VITE_CHECKOUT_URL
  if (!endpoint) return { demo: true }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: items.map(({ id, slot }) => ({ id, slot })) }),
  })
  if (!res.ok) throw new Error('Checkout failed. Please try again.')
  const { url } = await res.json()
  window.location.assign(url)
  return { demo: false }
}
