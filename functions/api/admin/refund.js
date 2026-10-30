// POST /api/admin/refund — { paymentId, amount? (cents, partial) } -> { refundId, status }
// Auth: the /api/admin middleware (Authorization: Bearer <ADMIN_TOKEN>).
import { json, readJson } from '../../_lib/util.js'
import { stripeConfigured, validateAmount, refundPayment } from '../../_lib/stripe.js'

export async function onRequestPost({ request, env }) {
  if (!stripeConfigured(env)) return json({ ok: false, error: 'Payments are not configured yet.' }, 503)
  try {
    const { paymentId, amount } = await readJson(request)
    if (!paymentId) return json({ ok: false, error: 'Missing required field: paymentId' }, 400)
    const result = await refundPayment(env, paymentId, amount ? validateAmount(amount) : undefined)
    return json({ ok: true, ...result })
  } catch (error) {
    console.error('Refund error:', error.message)
    return json({ ok: false, error: error.message }, 400)
  }
}
