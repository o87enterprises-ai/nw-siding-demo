// Email sending through Resend (free tier: 3,000/month, 100/day).
// With no RESEND_API_KEY the message is NOT sent; it is recorded as "dry-run".
// Every attempt is logged in the `messages` table.

export async function sendMail(env, { leadId = null, kind, to, subject, text, html, replyTo }) {
  let status = 'dry-run'
  let error = ''

  if (!to) {
    status = 'skipped'
    error = 'no recipient'
  } else if (env.RESEND_API_KEY && env.FROM_EMAIL) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: env.FROM_EMAIL,
          to: [to],
          subject,
          text,
          html,
          ...(replyTo ? { reply_to: replyTo } : {}),
        }),
      })
      if (res.ok) {
        status = 'sent'
      } else {
        status = 'failed'
        error = `resend ${res.status}: ${(await res.text()).slice(0, 300)}`
      }
    } catch (e) {
      status = 'failed'
      error = String(e && e.message ? e.message : e).slice(0, 300)
    }
  }

  try {
    await env.DB.prepare(
      'INSERT INTO messages (lead_id, kind, to_addr, subject, status, error) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(leadId, kind, to || '', subject, status, error).run()
  } catch {
    // logging must never break the request
  }
  return { status, error }
}
