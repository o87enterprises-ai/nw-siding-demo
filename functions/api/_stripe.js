/**
 * Shared Stripe helpers for NW Siding payment processing.
 *
 * Ported from the Open Pay (o87enterprises-ai/open-pay) provider contract to run
 * on the Cloudflare Workers runtime — Stripe's REST API is called directly with
 * `fetch` (no Node SDK) so it bundles cleanly into Pages Functions.
 *
 * Files prefixed with "_" are excluded from Pages Functions routing, so this is
 * an importable module rather than an endpoint.
 */

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
}

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

/** Is Stripe configured in this environment? */
export function stripeConfigured(env) {
  return Boolean(env && env.STRIPE_SECRET_KEY && env.STRIPE_PUBLISHABLE_KEY)
}

/** Public config returned to the frontend — keys only, never secrets. */
export function getFrontendConfig(env) {
  return {
    provider: (env && env.PAYMENT_PROVIDER) || 'stripe',
    publishableKey: (env && env.STRIPE_PUBLISHABLE_KEY) || null,
    configured: stripeConfigured(env),
  }
}

// ── Validation (ported from Open Pay server.js) ───────────────────────────────

export function validateAmount(amount) {
  const n = Number(amount)
  if (!Number.isInteger(n) || n < 50) {
    throw new Error('Invalid amount. Must be a positive integer in cents (minimum $0.50).')
  }
  if (n > 999999999) {
    throw new Error('Amount exceeds maximum allowed value.')
  }
  return n
}

export function sanitizeCurrency(currency) {
  const allowed = ['usd', 'eur', 'gbp', 'cad', 'aud', 'jpy']
  const c = (currency || 'usd').toLowerCase()
  if (!allowed.includes(c)) {
    throw new Error(`Unsupported currency: ${currency}. Allowed: ${allowed.join(', ')}`)
  }
  return c
}

// ── Form encoding for Stripe's x-www-form-urlencoded API ──────────────────────

/**
 * Encode a (possibly nested) object into Stripe's bracketed form syntax,
 * e.g. { metadata: { invoice: 'INV-1' } } -> "metadata[invoice]=INV-1".
 */
export function encodeForm(obj, prefix = '') {
  const parts = []
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue
    const field = prefix ? `${prefix}[${key}]` : key
    if (typeof value === 'object' && !Array.isArray(value)) {
      parts.push(encodeForm(value, field))
    } else {
      parts.push(`${encodeURIComponent(field)}=${encodeURIComponent(value)}`)
    }
  }
  return parts.filter(Boolean).join('&')
}

/** Low-level Stripe REST call. */
export async function stripeRequest(env, path, params, method = 'POST') {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: method === 'GET' ? undefined : encodeForm(params || {}),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = (data && data.error && data.error.message) || `Stripe request failed (${res.status})`
    throw new Error(message)
  }
  return data
}

// ── Stripe operations (mirror Open Pay's StripeProvider) ──────────────────────

export async function createPaymentIntent(env, { amount, currency, metadata }) {
  const params = {
    amount,
    currency,
    'automatic_payment_methods[enabled]': 'true',
  }
  if (metadata && typeof metadata === 'object') {
    for (const [k, v] of Object.entries(metadata)) {
      if (v !== undefined && v !== null && String(v).length) {
        // Stripe metadata values must be strings, max 500 chars each.
        params[`metadata[${k}]`] = String(v).slice(0, 500)
      }
    }
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

// ── Webhook signature verification (Web Crypto HMAC-SHA256) ────────────────────

export function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/**
 * Verify a Stripe webhook signature against the raw request body.
 * Returns the parsed event, or throws.
 */
export async function verifyStripeWebhook(rawBody, signatureHeader, secret, toleranceSeconds = 300) {
  if (!signatureHeader) throw new Error('Missing Stripe-Signature header')

  const parts = Object.fromEntries(
    signatureHeader.split(',').map((kv) => {
      const [k, ...rest] = kv.split('=')
      return [k.trim(), rest.join('=')]
    })
  )
  const timestamp = parts.t
  const expected = parts.v1
  if (!timestamp || !expected) throw new Error('Malformed Stripe-Signature header')

  // Replay protection
  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp))
  if (age > toleranceSeconds) throw new Error('Webhook timestamp outside tolerance')

  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sigBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(`${timestamp}.${rawBody}`))
  const computed = [...new Uint8Array(sigBuffer)].map((b) => b.toString(16).padStart(2, '0')).join('')

  if (!timingSafeEqual(computed, expected)) {
    throw new Error('Webhook signature mismatch')
  }
  return JSON.parse(rawBody)
}
