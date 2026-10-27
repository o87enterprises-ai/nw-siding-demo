// GET   /api/admin/leads?status=new&limit=50   - list leads (newest first) with their job, if any
// PATCH /api/admin/leads  { id, status?, notes? } - update a lead (simple CRM)
import { json, clean, readJson, LEAD_STATUSES } from '../../_lib/util.js'

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const status = url.searchParams.get('status')
  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '50', 10) || 50, 1), 200)
  if (status && !LEAD_STATUSES.includes(status)) return json({ ok: false, error: 'Unknown status' }, 400)

  const where = status ? 'WHERE l.status = ?' : ''
  const stmt = env.DB.prepare(
    `SELECT l.id, l.created_at, l.first_name, l.last_name, l.phone, l.email, l.address, l.zip, l.service, l.budget, l.timeline, l.message,
            l.source, l.utm_campaign, l.status, l.notes,
            j.status AS job_status, j.value_cents, j.review_requested_at
     FROM leads l LEFT JOIN jobs j ON j.lead_id = l.id
     ${where} ORDER BY l.id DESC LIMIT ?`
  )
  const { results } = await (status ? stmt.bind(status, limit) : stmt.bind(limit)).all()
  return json({ ok: true, leads: results })
}

export async function onRequestPatch({ request, env }) {
  let body
  try {
    body = await readJson(request)
  } catch (e) {
    return json({ ok: false, error: e.message }, 400)
  }
  const id = Number(body.id)
  if (!Number.isInteger(id) || id < 1) return json({ ok: false, error: 'id is required' }, 400)

  const sets = []
  const vals = []
  if (body.status !== undefined) {
    if (!LEAD_STATUSES.includes(body.status)) return json({ ok: false, error: 'Unknown status' }, 400)
    sets.push('status = ?')
    vals.push(body.status)
  }
  if (body.notes !== undefined) {
    sets.push('notes = ?')
    vals.push(clean(String(body.notes), 2000))
  }
  if (!sets.length) return json({ ok: false, error: 'Nothing to update' }, 400)

  const res = await env.DB.prepare(`UPDATE leads SET ${sets.join(', ')} WHERE id = ?`).bind(...vals, id).run()
  if (!res.meta.changes) return json({ ok: false, error: 'Lead not found' }, 404)
  return json({ ok: true })
}
