// POST /api/lead - public lead-capture endpoint used by the contact form.
import { json, clean, isEmail, isZip, phoneDigits, readJson, sha256Hex, SERVICES, BUDGETS, TIMELINES } from '../_lib/util.js'
import { sendMail } from '../_lib/mail.js'
import { ownerAlert, autoReply } from '../_lib/templates.js'

const RATE_LIMIT = 5 // leads per IP per 10 minutes

export async function onRequestPost({ request, env }) {
  let body
  try {
    body = await readJson(request)
  } catch (e) {
    return json({ ok: false, error: e.message }, 400)
  }

  // Honeypot: bots fill the hidden field. Pretend success, store nothing.
  if (clean(body.website, 100)) return json({ ok: true })

  const lead = {
    first_name: clean(body.first_name, 60),
    last_name: clean(body.last_name, 60),
    phone: clean(body.phone, 30),
    email: clean(body.email, 254).toLowerCase(),
    address: clean(body.address, 150),
    zip: clean(body.zip, 10),
    service: clean(body.service, 60),
    budget: clean(body.budget, 40),
    timeline: clean(body.timeline, 40),
    message: clean(body.message, 1000),
    source: clean(body.source, 40) || 'website',
    utm_source: clean(body.utm_source, 80),
    utm_medium: clean(body.utm_medium, 80),
    utm_campaign: clean(body.utm_campaign, 120),
    referrer: clean(body.referrer, 300),
    page: clean(body.page, 200),
  }

  const errors = {}
  if (!lead.first_name) errors.first_name = 'First name is required'
  if (!lead.phone && !lead.email) errors.contact = 'Enter a phone number or an email address'
  if (lead.phone && phoneDigits(lead.phone).length < 10) errors.phone = 'Enter a valid phone number'
  if (lead.email && !isEmail(lead.email)) errors.email = 'Enter a valid email address'
  if (lead.zip && !isZip(lead.zip)) errors.zip = 'Enter a 5-digit ZIP code'
  if (lead.service && !SERVICES.includes(lead.service)) errors.service = 'Pick a service from the list'
  if (lead.budget && !BUDGETS.includes(lead.budget)) errors.budget = 'Pick a budget from the list'
  if (lead.timeline && !TIMELINES.includes(lead.timeline)) errors.timeline = 'Pick a timeline from the list'
  if (Object.keys(errors).length) return json({ ok: false, errors }, 422)

  const ip = request.headers.get('cf-connecting-ip') || 'unknown'
  const ipHash = (await sha256Hex(`${env.IP_SALT || 'nw-siding'}:${ip}`)).slice(0, 32)

  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM leads WHERE ip_hash = ? AND created_at > datetime('now', '-10 minutes')"
  ).bind(ipHash).first()
  if (recent && recent.n >= RATE_LIMIT) return json({ ok: false, error: 'Too many requests. Please call us instead.' }, 429)

  const res = await env.DB.prepare(
    `INSERT INTO leads (first_name, last_name, phone, email, address, zip, service, budget, timeline, message, source,
                        utm_source, utm_medium, utm_campaign, referrer, page, ip_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    lead.first_name, lead.last_name, lead.phone, lead.email, lead.address, lead.zip, lead.service, lead.budget, lead.timeline, lead.message, lead.source,
    lead.utm_source, lead.utm_medium, lead.utm_campaign, lead.referrer, lead.page, ipHash
  ).run()
  lead.id = res.meta.last_row_id

  // Owner alert, then the auto-reply to the customer (only if they gave an email).
  const alert = ownerAlert(env, lead)
  await sendMail(env, { leadId: lead.id, kind: 'owner_alert', to: env.OWNER_EMAIL, replyTo: lead.email || undefined, ...alert })

  if (lead.email) {
    const reply = autoReply(env, lead)
    await sendMail(env, { leadId: lead.id, kind: 'auto_reply', to: lead.email, replyTo: env.OWNER_EMAIL, ...reply })
  }

  return json({ ok: true, id: lead.id }, 201)
}

export async function onRequest({ request }) {
  return json({ ok: false, error: 'Method not allowed' }, 405, { allow: 'POST' })
}
