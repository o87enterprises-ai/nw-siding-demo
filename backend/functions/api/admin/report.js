// GET /api/admin/report?month=YYYY-MM   (default: current month, UTC)
// The 30-day review numbers: leads generated, jobs booked, and revenue vs the previous month.
// Job values are reported by the owner (honor system).
import { json } from '../../_lib/util.js'

function monthRange(ym) {
  const [y, m] = ym.split('-').map(Number)
  const start = new Date(Date.UTC(y, m - 1, 1))
  const end = new Date(Date.UTC(y, m, 1))
  const prev = new Date(Date.UTC(y, m - 2, 1))
  const fmt = (d) => d.toISOString().slice(0, 10)
  const label = (d) => d.toISOString().slice(0, 7)
  return { start: fmt(start), end: fmt(end), prevStart: fmt(prev), prevLabel: label(prev) }
}

async function stats(env, start, end) {
  const leads = await env.DB.prepare(
    'SELECT COUNT(*) AS total, SUM(email != \'\') AS with_email FROM leads WHERE created_at >= ? AND created_at < ?'
  ).bind(start, end).first()
  const bySource = await env.DB.prepare(
    'SELECT source, COUNT(*) AS n FROM leads WHERE created_at >= ? AND created_at < ? GROUP BY source ORDER BY n DESC'
  ).bind(start, end).all()
  const byZip = await env.DB.prepare(
    "SELECT zip, COUNT(*) AS n FROM leads WHERE created_at >= ? AND created_at < ? AND zip != '' GROUP BY zip ORDER BY n DESC LIMIT 10"
  ).bind(start, end).all()
  const booked = await env.DB.prepare(
    "SELECT COUNT(*) AS n, COALESCE(SUM(value_cents), 0) AS cents FROM jobs WHERE booked_at >= ? AND booked_at < ? AND status != 'cancelled'"
  ).bind(start, end).first()
  const completed = await env.DB.prepare(
    "SELECT COUNT(*) AS n, COALESCE(SUM(value_cents), 0) AS cents FROM jobs WHERE completed_at >= ? AND completed_at < ? AND status = 'completed'"
  ).bind(start, end).first()
  return {
    leads: leads.total || 0,
    leads_with_email: leads.with_email || 0,
    leads_by_source: bySource.results,
    top_zips: byZip.results,
    jobs_booked: booked.n,
    booked_value: booked.cents / 100,
    jobs_completed: completed.n,
    completed_value: completed.cents / 100,
  }
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const month = url.searchParams.get('month') || new Date().toISOString().slice(0, 7)
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return json({ ok: false, error: 'month must be YYYY-MM' }, 400)

  const r = monthRange(month)
  const [current, previous] = await Promise.all([stats(env, r.start, r.end), stats(env, r.prevStart, r.start)])
  const delta = (a, b) => ({ change: Math.round((a - b) * 100) / 100, percent: b ? Math.round(((a - b) / b) * 1000) / 10 : null })

  return json({
    ok: true,
    month,
    previous_month: r.prevLabel,
    current,
    previous,
    compare: {
      leads: delta(current.leads, previous.leads),
      jobs_booked: delta(current.jobs_booked, previous.jobs_booked),
      booked_value: delta(current.booked_value, previous.booked_value),
      completed_value: delta(current.completed_value, previous.completed_value),
    },
    note: 'Job values are reported by the business owner (honor system).',
  })
}
