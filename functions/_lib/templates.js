// Email copy. Plain text plus a simple HTML version; all lead-supplied text is escaped.
import { escapeHtml as h } from './util.js'

const biz = (env) => env.BUSINESS_NAME || 'Northwest Siding'
const phone = (env) => env.BUSINESS_PHONE || '(541) 688-2997'

export function ownerAlert(env, lead) {
  const name = `${lead.first_name} ${lead.last_name}`.trim()
  const lines = [
    ['Name', name],
    ['Phone', lead.phone],
    ['Email', lead.email],
    ['Address', lead.address],
    ['ZIP', lead.zip],
    ['Service', lead.service],
    ['Budget', lead.budget],
    ['Timeline', lead.timeline],
    ['Message', lead.message],
    ['Source', lead.source + (lead.utm_campaign ? ` / ${lead.utm_campaign}` : '')],
    ['Page', lead.page],
  ].filter(([, v]) => v)
  // Opens the property on Google Maps (switch to satellite or Street View there).
  const place = [lead.address, lead.zip].filter(Boolean).join(' ')
  const mapUrl = place ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place + ' OR')}` : ''
  const text =
    `New estimate request #${lead.id}\n\n` + lines.map(([k, v]) => `${k}: ${v}`).join('\n') +
    (mapUrl ? `\n\nView the property: ${mapUrl}` : '') + '\n\nCall or reply as soon as you can.'
  const html =
    `<p><b>New estimate request #${lead.id}</b></p><table cellpadding="4">` +
    lines.map(([k, v]) => `<tr><td><b>${h(k)}</b></td><td>${h(v)}</td></tr>`).join('') +
    '</table>' +
    (mapUrl ? `<p><a href="${h(mapUrl)}">View the property on Google Maps</a></p>` : '') +
    '<p>Call or reply as soon as you can.</p>'
  return { subject: `New lead: ${name} (${lead.service || 'estimate'})`, text, html }
}

export function autoReply(env, lead) {
  const text =
    `Hi ${lead.first_name},\n\n` +
    `Thanks for reaching out to ${biz(env)}. We received your estimate request` +
    (lead.service ? ` for ${lead.service}` : '') +
    ` and will get back to you within one business day.\n\n` +
    `If it is urgent, call us at ${phone(env)}.\n\n` +
    `${biz(env)}`
  const html =
    `<p>Hi ${h(lead.first_name)},</p>` +
    `<p>Thanks for reaching out to ${h(biz(env))}. We received your estimate request` +
    (lead.service ? ` for ${h(lead.service)}` : '') +
    ` and will get back to you within one business day.</p>` +
    `<p>If it is urgent, call us at ${h(phone(env))}.</p><p>${h(biz(env))}</p>`
  return { subject: `We got your request - ${biz(env)}`, text, html }
}

export function reviewRequest(env, lead, reviewUrl) {
  const text =
    `Hi ${lead.first_name},\n\n` +
    `Thank you for choosing ${biz(env)}. If you are happy with the work, a short Google review helps other homeowners find us:\n\n` +
    `${reviewUrl}\n\n` +
    `If anything is not right, reply to this email or call ${phone(env)} and we will make it right.\n\n` +
    `${biz(env)}`
  const html =
    `<p>Hi ${h(lead.first_name)},</p>` +
    `<p>Thank you for choosing ${h(biz(env))}. If you are happy with the work, a short Google review helps other homeowners find us:</p>` +
    `<p><a href="${h(reviewUrl)}">Leave a review</a></p>` +
    `<p>If anything is not right, reply to this email or call ${h(phone(env))} and we will make it right.</p><p>${h(biz(env))}</p>`
  return { subject: `How did we do? - ${biz(env)}`, text, html }
}
