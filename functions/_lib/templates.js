// Email copy. Plain text plus a simple HTML version; all lead-supplied text is escaped.
import { escapeHtml as h } from './util.js'

const biz = (env) => env.BUSINESS_NAME || 'Northwest Siding'
const phone = (env) => env.BUSINESS_PHONE || '(541) 688-2997'

const usd = (n) => '$' + Math.round(n).toLocaleString('en-US')
const pacific = (d) =>
  new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', dateStyle: 'medium', timeStyle: 'short' }).format(d)
const sinceLabel = (iso) => {
  // D1 stores UTC as "YYYY-MM-DD HH:MM:SS"
  const t = Date.parse(String(iso).replace(' ', 'T') + 'Z')
  return Number.isNaN(t) ? '' : pacific(new Date(t))
}

// extras (all optional): { property, prior, receivedAt }
//   property - result of lookupProperty(); prior - earlier requests from the same person
export function ownerAlert(env, lead, extras = {}) {
  const { property, prior, receivedAt } = extras
  const name = `${lead.first_name} ${lead.last_name}`.trim()

  // Things worth knowing before picking up the phone.
  const flags = []
  if (prior) {
    flags.push(
      `Repeat contact: ${prior.count} earlier request${prior.count > 1 ? 's' : ''} from this phone or email` +
        (prior.last_at ? `, most recent ${sinceLabel(prior.last_at)}` : '') +
        (prior.last_service ? ` (${prior.last_service})` : '') + '.'
    )
  }
  const year = property && property.status === 'found' ? property.year_built : null
  const yearNow = (receivedAt || new Date()).getFullYear()
  if (year && year < 1978) flags.push(`Built in ${year}: lead-safe work practices (EPA RRP) may apply when disturbing painted surfaces.`)
  if (property && property.status === 'found' && property.ambiguous) flags.push('The address matched more than one county parcel. Confirm the exact property.')
  if (property && property.status === 'not_found') flags.push('Address not found in Lane County records. It may be outside the county or typed differently; confirm on the call.')

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
    ['Received', receivedAt ? pacific(receivedAt) + ' PT' : ''],
    ['Source', lead.source + (lead.utm_campaign ? ` / ${lead.utm_campaign}` : '')],
    ['Page', lead.page],
  ].filter(([, v]) => v)

  // County records (assessor). Values are county figures, not appraisals.
  let propLines = []
  if (property && property.status === 'found') {
    propLines = [
      ['County record', property.matched_address],
      ['Year built', year ? `${year} (${yearNow - year} years old)` : ''],
      ['Building type', property.building_type],
      ['Lot size', property.lot_acres ? `${property.lot_acres} acres` : ''],
      ['Assessed value', property.assessed_value ? usd(property.assessed_value) : ''],
      ['Buildings / land', property.improvement_value || property.land_value
        ? `${property.improvement_value ? usd(property.improvement_value) : 'n/a'} / ${property.land_value ? usd(property.land_value) : 'n/a'}` : ''],
      ['Zoning', property.zoning],
      ['Class', property.property_class],
      ['Account / tax lot', [property.account, property.maptaxlot].filter(Boolean).join(' / ')],
    ].filter(([, v]) => v)
  }

  // Opens the property on Google Maps (switch to satellite or Street View there).
  const place = [lead.address, lead.zip].filter(Boolean).join(' ')
  const hasState = /\b(OR|Oregon)\b/i.test(place)
  const mapUrl = place ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hasState ? place : place + ' OR')}` : ''
  const portalUrl = 'https://apps.lanecounty.org/PropertyAccountInformation/'
  const propNote = 'Lane County assessor records. Values are county figures, not an appraisal, and square footage is not included.'

  const table = (rows) => '<table cellpadding="4">' + rows.map(([k, v]) => `<tr><td><b>${h(k)}</b></td><td>${h(v)}</td></tr>`).join('') + '</table>'
  const text =
    `New estimate request #${lead.id}\n` +
    (flags.length ? '\nBefore you call:\n' + flags.map((f) => `* ${f}`).join('\n') + '\n' : '') +
    '\n' + lines.map(([k, v]) => `${k}: ${v}`).join('\n') +
    (propLines.length ? `\n\nProperty: ${propNote}\n` + propLines.map(([k, v]) => `${k}: ${v}`).join('\n') : '') +
    (mapUrl ? `\n\nView the property: ${mapUrl}` : '') +
    (propLines.length ? `\nCounty property portal: ${portalUrl}` : '') +
    '\n\nCall or reply as soon as you can.'
  const html =
    `<p><b>New estimate request #${lead.id}</b></p>` +
    (flags.length ? `<p><b>Before you call</b></p><ul>${flags.map((f) => `<li>${h(f)}</li>`).join('')}</ul>` : '') +
    table(lines) +
    (propLines.length ? `<p><b>Property</b><br><small>${h(propNote)}</small></p>${table(propLines)}` : '') +
    (mapUrl ? `<p><a href="${h(mapUrl)}">View the property on Google Maps</a>` : '<p>') +
    (propLines.length ? `${mapUrl ? ' &middot; ' : ''}<a href="${h(portalUrl)}">Lane County property portal</a>` : '') +
    '</p><p>Call or reply as soon as you can.</p>'
  return { subject: `New lead: ${name} (${lead.service || 'estimate'})${prior ? ' - repeat contact' : ''}`, text, html }
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
