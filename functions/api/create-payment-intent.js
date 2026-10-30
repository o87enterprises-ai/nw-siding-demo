// POST /api/create-payment-intent — { amount (cents), currency, metadata } -> { clientSecret, paymentIntentId }
import { json, readJson } from '../_lib/util.js'
import { stripeConfigured, validateAmount, sanitizeCurrency, createPaymentIntent } from '../_lib/stripe.js'

export async function onRequestPost({ request, env }) {
  if (!stripeConfigured(env)) {
    return json({ error: 'Payments are not configured yet.' }, 503)
  }
  try {
    const body = await readJson(request)
    const result = await createPaymentIntent(env, {
      amount: validateAmount(body.amount),
      currency: sanitizeCurrency(body.currency),
      metadata: body.metadata && typeof body.metadata === 'object' ? body.metadata : {},
    })
    return json(result)
  } catch (error) {
    console.error('Payment intent error:', error.message)
    return json({ error: error.message }, 400)
  }
}
