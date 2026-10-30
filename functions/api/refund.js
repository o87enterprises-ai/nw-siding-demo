/**
 * Cloudflare Pages Function: POST /api/refund
 * Refunds a payment by PaymentIntent id. Ported from Open Pay's /api/refund.
 *
 * Accepts: { paymentId, amount? (cents, partial refund) }
 * Returns: { refundId, status }
 *
 * NOTE: This endpoint is unauthenticated in Open Pay's reference implementation.
 * Before exposing refunds publicly, gate this behind an admin token
 * (e.g. check request header against env.ADMIN_API_TOKEN).
 */
import {
  CORS_HEADERS,
  json,
  stripeConfigured,
  validateAmount,
  refundPayment,
} from './_stripe.js'

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function onRequestPost({ request, env }) {
  if (!stripeConfigured(env)) {
    return json({ error: 'Payments are not configured yet.' }, 503)
  }

  // Optional admin gate: if ADMIN_API_TOKEN is set, require it.
  if (env.ADMIN_API_TOKEN) {
    const provided = request.headers.get('x-admin-token')
    if (provided !== env.ADMIN_API_TOKEN) {
      return json({ error: 'Unauthorized' }, 401)
    }
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
