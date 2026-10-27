// POST /api/admin/jobs { lead_id, status: booked|completed|cancelled, value?: dollars }
// Creates or updates the job for a lead (values are reported by the owner - honor system).
// Marking a job "completed" sends the review request once, if the lead has an email.
import { json, readJson, JOB_STATUSES } from '../../_lib/util.js'
import { sendMail } from '../../_lib/mail.js'
import { reviewRequest } from '../../_lib/templates.js'

export async function onRequestPost({ request, env }) {
  let body
  try {
    body = await readJson(request)
  } catch (e) {
    return json({ ok: false, error: e.message }, 400)
  }

  const leadId = Number(body.lead_id)
  if (!Number.isInteger(leadId) || leadId < 1) return json({ ok: false, error: 'lead_id is required' }, 400)
  const status = body.status || 'booked'
  if (!JOB_STATUSES.includes(status)) return json({ ok: false, error: 'Unknown job status' }, 400)

  let valueCents = null
  if (body.value !== undefined && body.value !== null && body.value !== '') {
    const dollars = Number(body.value)
    if (!Number.isFinite(dollars) || dollars < 0 || dollars > 10000000) return json({ ok: false, error: 'Invalid value' }, 400)
    valueCents = Math.round(dollars * 100)
  }

  const lead = await env.DB.prepare('SELECT * FROM leads WHERE id = ?').bind(leadId).first()
  if (!lead) return json({ ok: false, error: 'Lead not found' }, 404)

  const existing = await env.DB.prepare('SELECT * FROM jobs WHERE lead_id = ?').bind(leadId).first()
  if (!existing) {
    await env.DB.prepare(
      `INSERT INTO jobs (lead_id, status, value_cents, completed_at)
       VALUES (?, ?, ?, CASE WHEN ? = 'completed' THEN datetime('now') END)`
    ).bind(leadId, status, valueCents ?? 0, status).run()
  } else {
    await env.DB.prepare(
      `UPDATE jobs SET status = ?, value_cents = COALESCE(?, value_cents),
         completed_at = CASE WHEN ? = 'completed' AND completed_at IS NULL THEN datetime('now') ELSE completed_at END
       WHERE lead_id = ?`
    ).bind(status, valueCents, status, leadId).run()
  }
  if (status !== 'cancelled') {
    await env.DB.prepare("UPDATE leads SET status = 'booked' WHERE id = ?").bind(leadId).run()
  }

  // Review request: only once per job, only for completed jobs, only with an email.
  let review = 'not-applicable'
  if (status === 'completed') {
    const job = await env.DB.prepare('SELECT review_requested_at FROM jobs WHERE lead_id = ?').bind(leadId).first()
    if (job.review_requested_at) {
      review = 'already-requested'
    } else if (!lead.email) {
      review = 'no-email'
    } else if (!env.GOOGLE_REVIEW_URL) {
      review = 'no-review-url'
    } else {
      const msg = reviewRequest(env, lead, env.GOOGLE_REVIEW_URL)
      const out = await sendMail(env, { leadId, kind: 'review_request', to: lead.email, replyTo: env.OWNER_EMAIL, ...msg })
      review = out.status
      if (out.status === 'sent' || out.status === 'dry-run') {
        await env.DB.prepare("UPDATE jobs SET review_requested_at = datetime('now') WHERE lead_id = ?").bind(leadId).run()
      }
    }
  }

  return json({ ok: true, review })
}
