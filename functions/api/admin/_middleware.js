// Every /api/admin/* route requires:  Authorization: Bearer <ADMIN_TOKEN>
import { json, safeEqual } from '../../_lib/util.js'

export async function onRequest(context) {
  const { request, env } = context
  if (!env.ADMIN_TOKEN || env.ADMIN_TOKEN.length < 16) {
    return json({ ok: false, error: 'Admin access is not configured' }, 503)
  }
  const header = request.headers.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token || !safeEqual(token, env.ADMIN_TOKEN)) {
    return json({ ok: false, error: 'Unauthorized' }, 401)
  }
  return context.next()
}
