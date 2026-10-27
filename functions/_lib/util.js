// Small shared helpers for the Pages Functions.

export const SERVICES = [
  'Fiber Cement Siding',
  'Cedar / Wood Siding',
  'Replacement Windows',
  'Seamless Gutters',
  'Painting & Trim',
  'Multiple Services',
]

// Optional qualifying answers from the estimate form. Keep in sync with src/components/Contact.jsx.
export const BUDGETS = ['Under $5,000', '$5,000 - $15,000', '$15,000 - $30,000', '$30,000+', 'Not sure yet']
export const TIMELINES = ['As soon as possible', 'Within 1-3 months', '3-6 months', 'Just exploring']

export const LEAD_STATUSES = ['new', 'contacted', 'quoted', 'booked', 'lost']
export const JOB_STATUSES = ['booked', 'completed', 'cancelled']

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  })
}

// Trim, drop control characters (blocks header injection), cap length.
export function clean(value, max = 200) {
  if (typeof value !== 'string') return ''
  return value.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim().slice(0, max)
}

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254
export const isZip = (v) => /^\d{5}$/.test(v)
export const phoneDigits = (v) => v.replace(/\D/g, '')

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

export async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Constant-time string compare.
export function safeEqual(a, b) {
  const x = new TextEncoder().encode(String(a))
  const y = new TextEncoder().encode(String(b))
  let diff = x.length ^ y.length
  const n = Math.max(x.length, y.length)
  for (let i = 0; i < n; i++) diff |= (x[i] || 0) ^ (y[i] || 0)
  return diff === 0
}

export async function readJson(request, maxBytes = 20000) {
  const text = await request.text()
  if (text.length > maxBytes) throw new Error('payload too large')
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('invalid json')
  }
}
