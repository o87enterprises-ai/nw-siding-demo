/**
 * Cloudflare Pages Function: POST /api/payment-webhook
 * Stripe webhook receiver with signature verification (Web Crypto HMAC-SHA256).
 * Ported from Open Pay's /webhook handler.
 *
 * Configure this URL in the Stripe Dashboard and set STRIPE_WEBHOOK_SECRET.
 * On payment success, optionally forwards to PAYMENT_WEBHOOK_URL (CRM/Zapier/Slack)
 * and emails a summary (including the customer's review) via Resend if configured.
 */
import { verifyStripeWebhook } from './_stripe.js'

export async function onRequestPost({ request, env }) {
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event
  try {
    if (!env.STRIPE_WEBHOOK_SECRET) throw new Error('STRIPE_WEBHOOK_SECRET not configured')
    event = await verifyStripeWebhook(rawBody, signature, env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook verification failed:', err.message)
    return new Response('Webhook verification failed', { status: 400 })
  }

  const obj = event.data && event.data.object ? event.data.object : {}

  switch (event.type) {
    case 'payment_intent.succeeded': {
      console.log('✅ Payment succeeded:', obj.id, obj.amount, obj.currency)
      await notifySuccess(env, obj)
      break
    }
    case 'payment_intent.payment_failed':
      console.log('❌ Payment failed:', obj.id)
      break
    case 'payment_intent.created':
      console.log('📝 Payment created:', obj.id)
      break
    default:
      console.log('ℹ️  Unhandled event type:', event.type)
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

async function notifySuccess(env, pi) {
  const meta = pi.metadata || {}
  const amount = (pi.amount / 100).toLocaleString('en-US', { style: 'currency', currency: (pi.currency || 'usd').toUpperCase() })

  const payload = {
    event: 'payment_succeeded',
    source: 'northwestsiding.com',
    paymentIntentId: pi.id,
    amount,
    type: meta.type || 'payment',
    invoice: meta.invoice || null,
    customerName: meta.customerName || null,
    rating: meta.rating || null,
    review: meta.review || null,
    receivedAt: new Date().toISOString(),
  }

  // Forward to optional CRM/automation webhook
  if (env.PAYMENT_WEBHOOK_URL) {
    try {
      await fetch(env.PAYMENT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch (err) {
      console.error('Payment webhook forward failed:', err.message)
    }
  }

  // Email summary via Resend (reuses the contact form's config)
  if (env.RESEND_API_KEY && env.CONTACT_EMAIL_TO) {
    // Metadata comes from the customer's browser — escape before putting it in HTML.
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
    const rating = Math.min(5, Math.max(0, Math.round(Number(payload.rating)) || 0))
    const stars = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : '—'
    const html = `
      <h2>💳 Payment Received — ${amount}</h2>
      <p><strong>Type:</strong> ${esc(payload.type)}${payload.invoice ? ` &middot; <strong>Invoice:</strong> ${esc(payload.invoice)}` : ''}</p>
      ${payload.customerName ? `<p><strong>Customer:</strong> ${esc(payload.customerName)}</p>` : ''}
      ${payload.review ? `<p><strong>Rating:</strong> ${stars} (${rating}/5)</p><blockquote>${esc(payload.review)}</blockquote>` : ''}
      <p style="color:#888;font-size:12px;">Stripe PaymentIntent: ${esc(pi.id)}</p>
    `
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.CONTACT_EMAIL_FROM || 'Northwest Siding <leads@northwestsiding.com>',
          to: env.CONTACT_EMAIL_TO,
          subject: `💳 Payment received — ${amount}${payload.invoice ? ` (Invoice ${payload.invoice})` : ''}`,
          html,
        }),
      })
    } catch (err) {
      console.error('Payment email failed:', err.message)
    }
  }
}
