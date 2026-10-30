// Stripe helpers for /pay and /pos. Calls Stripe's REST API with fetch (no Node SDK) so it
// bundles into Pages Functions. Ported from Open Pay's provider contract.
import { safeEqual } from './util.js'

export function stripeConfigured(env) {
  return Boolean(env && env.STRIPE_SECRET_KEY && env.STRIPE_PUBLISHABLE_KEY)
}

// Public config for the browser: the publishable key only, never secrets.
export function frontendConfig(env) {
  return {
    provider: 'stripe',
    publishableKey: (env && env.STRIPE_PUBLISHABLE_KEY) || null,
    configured: stripeConfigured(env),
  }
}

export function validateAmount(amount) {
  const n = Number(amount)
  if (!Number.isInteger(n) || n < 50) throw new Error('Invalid amount. Must be a whole number of cents (minimum $0.50).')
  if (n > 999999999) throw new Error('Amount exceeds maximum allowed value.')
  return n
}

export function sanitizeCurrency(currency) {
  const allowed = ['usd', 'eur', 'gbp', 'cad', 'aud', 'jpy']
  const c = (currency || 'usd').toLowerCase()
  if (!allowed.includes(c)) throw new Error(`Unsupported currency: ${currency}. Allowed: ${allowed.join(', ')}`)
  return c
}

// Stripe's x-www-form-urlencoded bracket syntax: { metadata: { a: 1 } } -> "metadata[a]=1".
function encodeForm(obj, prefix = '') {
  const parts = []
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue
    const field = prefix ? `${prefix}[${key}]` : key
    if (typeof value === 'object' && !Array.isArray(value)) parts.push(encodeForm(value, field))
    else parts.push(`${encodeURIComponent(field)}=${encodeURIComponent(value)}`)
  }
  return parts.filter(Boolean).join('&')
}

async function stripeRequest(env, path, params) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: encodeForm(params || {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((data && data.error && data.error.message) || `Stripe request failed (${res.status})`)
  return data
}

export async function createPaymentIntent(env, { amount, currency, metadata }) {
  const params = { amount, currency, 'automatic_payment_methods[enabled]': 'true' }
  for (const [k, v] of Object.entries(metadata || {})) {
    // Stripe metadata values must be strings, max 500 chars each.
    if (v !== undefined && v !== null && String(v).length) params[`metadata[${k}]`] = String(v).slice(0, 500)
  }
  const pi = await stripeRequest(env, 'payment_intents', params)
  return { clientSecret: pi.client_secret, paymentIntentId: pi.id }
}

export async function refundPayment(env, paymentId, amount) {
  const params = { payment_intent: paymentId }
  if (amount) params.amount = amount
  const refund = await stripeRequest(env, 'refunds', params)
  return { refundId: refund.id, status: refund.status }
}

// Verify a Stripe-Signature header against the raw body (HMAC-SHA256). Returns the parsed event or throws.
export async function verifyStripeWebhook(rawBody, signatureHeader, secret, toleranceSeconds = 300) {
  if (!signatureHeader) throw new Error('Missing Stripe-Signature header')
  const parts = Object.fromEntries(
    signatureHeader.split(',').map((kv) => {
      const [k, ...rest] = kv.split('=')
      return [k.trim(), rest.join('=')]
    })
  )
  const { t: timestamp, v1: expected } = parts
  if (!timestamp || !expected) throw new Error('Malformed Stripe-Signature header')

  // Replay protection
  if (Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp)) > toleranceSeconds) {
    throw new Error('Webhook timestamp outside tolerance')
  }

  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`${timestamp}.${rawBody}`))
  const computed = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
  if (!safeEqual(computed, expected)) throw new Error('Webhook signature mismatch')
  return JSON.parse(rawBody)
}
