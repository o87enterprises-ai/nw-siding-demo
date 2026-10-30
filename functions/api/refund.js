/**
 * Cloudflare Pages Function: POST /api/refund
 * Refunds a payment by PaymentIntent id. Ported from Open Pay's /api/refund.
 *
 * Accepts: { paymentId, amount? (cents, partial refund) }
 * Returns: { refundId, status }
 *
 * Requires env.ADMIN_API_TOKEN; callers must send it in the x-admin-token header.
 * Same-origin only (no CORS headers), so browsers on other sites can't call it.
 */
import {
  json,
  stripeConfigured,
  validateAmount,
  refundPayment,
  timingSafeEqual,
} from './_stripe.js'

export async function onRequestPost({ request, env }) {
  if (!stripeConfigured(env)) {
    return json({ error: 'Payments are not configured yet.' }, 503)
  }

  // Admin gate: refunds are disabled unless ADMIN_API_TOKEN is set, and callers must send it.
  if (!env.ADMIN_API_TOKEN) {
    return json({ error: 'Refunds are disabled. Set ADMIN_API_TOKEN to enable.' }, 403)
  }
  const provided = request.headers.get('x-admin-token') || ''
  if (!timingSafeEqual(provided, env.ADMIN_API_TOKEN)) {
    return json({ error: 'Unauthorized' }, 401)
  }

  try {
    const body = await request.json().catch(() => ({}))
    const { paymentId, amount } = body
    if (!paymentId) {
      return json({ error: 'Missing required field: paymentId' }, 400)
    }

    const result = await refundPayment(env, paymentId, amount ? validateAmount(amount) : undefined)
    return json(result)
  } catch (error) {
    console.error('Refund error:', error.message)
    return json({ error: error.message }, 400)
  }
}
