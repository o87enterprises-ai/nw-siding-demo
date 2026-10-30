/**
 * Cloudflare Pages Function: POST /api/create-payment-intent
 * Creates a Stripe PaymentIntent. Ported from Open Pay's endpoint of the same name.
 *
 * Accepts: { amount (cents), currency, metadata }
 * Returns: { clientSecret, paymentIntentId }
 */
import {
  CORS_HEADERS,
  json,
  stripeConfigured,
  validateAmount,
  sanitizeCurrency,
  createPaymentIntent,
} from './_stripe.js'

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function onRequestPost({ request, env }) {
  if (!stripeConfigured(env)) {
    return json(
      { error: 'Payments are not configured yet. Please add Stripe keys to the environment.' },
      503
    )
  }

  try {
    const body = await request.json().catch(() => ({}))
    const { amount, currency, metadata } = body

    const validatedAmount = validateAmount(amount)
    const validatedCurrency = sanitizeCurrency(currency)

    const result = await createPaymentIntent(env, {
      amount: validatedAmount,
      currency: validatedCurrency,
      metadata: typeof metadata === 'object' && metadata ? metadata : {},
    })

    return json(result)
  } catch (error) {
    console.error('Payment intent error:', error.message)
    return json({ error: error.message }, 400)
  }
}
