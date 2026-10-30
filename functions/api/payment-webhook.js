// POST /api/payment-webhook — Stripe webhook receiver (signature-verified).
// On payment success: emails the owner (OWNER_EMAIL) and optionally forwards to PAYMENT_WEBHOOK_URL.
import { escapeHtml } from '../_lib/util.js'
import { sendMail } from '../_lib/mail.js'
import { verifyStripeWebhook } from '../_lib/stripe.js'

export async function onRequestPost({ request, env }) {
  const rawBody = await request.text()
  let event
  try {
    if (!env.STRIPE_WEBHOOK_SECRET) throw new Error('STRIPE_WEBHOOK_SECRET not configured')
    event = await verifyStripeWebhook(rawBody, request.headers.get('stripe-signature'), env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook verification failed:', err.message)
    return new Response('Webhook verification failed', { status: 400 })
  }

  const obj = (event.data && event.data.object) || {}
  if (event.type === 'payment_intent.succeeded') {
    await notifySuccess(env, obj)
  } else if (event.type === 'payment_intent.payment_failed') {
    console.log('Payment failed:', obj.id)
  }

  return new Response(JSON.stringify({ received: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
}

async function notifySuccess(env, pi) {
  const meta = pi.metadata || {}
  const amount = (pi.amount / 100).toLocaleString('en-US', { style: 'currency', currency: (pi.currency || 'usd').toUpperCase() })
  // Metadata comes from the customer's browser, so it is escaped before going into HTML.
  const rating = Math.min(5, Math.max(0, Math.round(Number(meta.rating)) || 0))
  const type = meta.type || 'payment'

  if (env.PAYMENT_WEBHOOK_URL) {
    try {
      await fetch(env.PAYMENT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'payment_succeeded',
          paymentIntentId: pi.id,
          amount,
          type,
          invoice: meta.invoice || null,
          customerName: meta.customerName || null,
          rating: rating || null,
          review: meta.review || null,
          receivedAt: new Date().toISOString(),
        }),
      })
    } catch (err) {
      console.error('Payment webhook forward failed:', err.message)
    }
  }

  const lines = [
    `Payment received: ${amount}`,
    `Type: ${type}${meta.invoice ? ` · Invoice: ${meta.invoice}` : ''}`,
    meta.customerName ? `Customer: ${meta.customerName}` : '',
    meta.note ? `Note: ${meta.note}` : '',
    meta.review ? `Rating: ${rating}/5\nReview: ${meta.review}` : '',
    `Stripe PaymentIntent: ${pi.id}`,
  ].filter(Boolean)
  const stars = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : ''
  const html = `
    <h2>Payment Received — ${escapeHtml(amount)}</h2>
    <p><strong>Type:</strong> ${escapeHtml(type)}${meta.invoice ? ` &middot; <strong>Invoice:</strong> ${escapeHtml(meta.invoice)}` : ''}</p>
    ${meta.customerName ? `<p><strong>Customer:</strong> ${escapeHtml(meta.customerName)}</p>` : ''}
    ${meta.note ? `<p><strong>Note:</strong> ${escapeHtml(meta.note)}</p>` : ''}
    ${meta.review ? `<p><strong>Rating:</strong> ${stars} (${rating}/5)</p><blockquote>${escapeHtml(meta.review)}</blockquote>` : ''}
    <p style="color:#888;font-size:12px;">Stripe PaymentIntent: ${escapeHtml(pi.id)}</p>`

  await sendMail(env, {
    kind: 'payment_received',
    to: env.OWNER_EMAIL,
    subject: `Payment received — ${amount}${meta.invoice ? ` (Invoice ${String(meta.invoice).slice(0, 60)})` : ''}`,
    text: lines.join('\n'),
    html,
  })
}
