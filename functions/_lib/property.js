// Property lookup against Lane County's public GIS (assessor data). Free, no key.
// Gives year built, building type, lot size and values. It does not have square footage.
// Used to enrich the owner alert; it must never block or break lead capture.

const BASE = 'https://lcgispubags.lanecountyor.gov/arcgis/rest/services/ePass/Accela_APO/MapServer'
const TIMEOUT_MS = 4000

const DIRECTIONS = { N: 'N', S: 'S', E: 'E', W: 'W', NORTH: 'N', SOUTH: 'S', EAST: 'E', WEST: 'W', NE: 'NE', NW: 'NW', SE: 'SE', SW: 'SW' }
const SUFFIXES = {
  STREET: 'ST', ST: 'ST', AVENUE: 'AVE', AVE: 'AVE', ROAD: 'RD', RD: 'RD', DRIVE: 'DR', DR: 'DR', LANE: 'LN', LN: 'LN',
  COURT: 'CT', CT: 'CT', CIRCLE: 'CIR', CIR: 'CIR', PLACE: 'PL', PL: 'PL', BOULEVARD: 'BLVD', BLVD: 'BLVD', HIGHWAY: 'HWY', HWY: 'HWY',
  WAY: 'WAY', LOOP: 'LOOP', TERRACE: 'TER', TER: 'TER', PARKWAY: 'PKWY', PKWY: 'PKWY', TRAIL: 'TRL', TRL: 'TRL',
}
const UNIT_WORDS = new Set(['APT', 'UNIT', 'STE', 'SUITE', 'SPC', 'SPACE', 'LOT', 'BLDG'])

// "123 East Main Street, Eugene" -> { num: '123', dir: 'E', name: 'MAIN', type: 'ST' }
export function parseStreetAddress(raw) {
  const street = String(raw || '').split(',')[0].toUpperCase().replace(/[.#]/g, ' ').replace(/\s+/g, ' ').trim()
  const tokens = street.split(' ').filter(Boolean)
  if (tokens.length < 2 || !/^\d{1,6}$/.test(tokens[0])) return null
  const num = tokens.shift()
  const unitAt = tokens.findIndex((t) => UNIT_WORDS.has(t))
  if (unitAt > 0) tokens.length = unitAt
  let type = ''
  if (tokens.length > 1 && SUFFIXES[tokens[tokens.length - 1]]) type = SUFFIXES[tokens.pop()]
  let dir = ''
  if (tokens.length > 1 && DIRECTIONS[tokens[0]]) dir = DIRECTIONS[tokens.shift()]
  const name = tokens.join(' ').replace(/[^A-Z0-9 ]/g, '')
  if (!name) return null
  return { num, dir, name, type }
}

async function query(layer, params) {
  const url = `${BASE}/${layer}/query?` + new URLSearchParams({ f: 'json', returnGeometry: 'false', ...params })
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!res.ok) throw new Error(`county gis ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(`county gis: ${data.error.message}`)
  return data.features.map((f) => f.attributes)
}

const sq = (s) => String(s).replace(/'/g, "''")
const num = (v) => (typeof v === 'number' && v > 0 ? Math.round(v) : null)

// Returns { status: 'found' | 'not_found' | 'error', ...fields }. Never throws.
export async function lookupProperty(address, zip) {
  try {
    const p = parseStreetAddress(address)
    if (!p) return { status: 'skipped' }

    const like = `${p.num} %${p.name}%`
    const addrs = await query(0, {
      where: `concat_address LIKE '${sq(like)}'`,
      outFields: 'concat_address,five_digit_zip_code,maptaxlot,account',
      resultRecordCount: '25',
    })
    if (!addrs.length) return { status: 'not_found' }

    const wanted = [p.num, p.dir, p.name, p.type].filter(Boolean).join(' ')
    const stripUnit = (a) => String(a).replace(/\s+(APT|UNIT|STE|SPC|LOT|BLDG)\b.*$/, '').trim()
    const exact = addrs.filter((a) => stripUnit(a.concat_address) === wanted)
    let pool = exact.length ? exact : addrs
    const sameZip = zip ? pool.filter((a) => a.five_digit_zip_code === zip) : []
    if (sameZip.length) pool = sameZip
    const pick = pool[0]
    if (!pick.maptaxlot) return { status: 'not_found' }
    const lots = new Set(pool.map((a) => a.maptaxlot))

    const parcels = await query(1, {
      where: `MAPTAXLOT='${sq(pick.maptaxlot)}'`,
      outFields: 'YEARBLT,BLDGTYPE,IMPVAL,LANDVAL,ASSDTOTVAL,MAPACRES,zoningdesc,PROPCLDES,ACCTNO,MAPTAXLOT',
      resultRecordCount: '1',
    })
    const a = parcels[0]
    if (!a) return { status: 'not_found' }
    const yb = parseInt(a.YEARBLT, 10)
    return {
      status: 'found',
      matched_address: pick.concat_address,
      exact: exact.length > 0,
      ambiguous: lots.size > 1,
      year_built: yb >= 1700 && yb <= 2100 ? yb : null,
      building_type: a.BLDGTYPE || '',
      property_class: a.PROPCLDES || '',
      lot_acres: typeof a.MAPACRES === 'number' && a.MAPACRES > 0 ? Math.round(a.MAPACRES * 100) / 100 : null,
      assessed_value: num(a.ASSDTOTVAL),
      improvement_value: num(a.IMPVAL),
      land_value: num(a.LANDVAL),
      zoning: a.zoningdesc || '',
      account: a.ACCTNO || '',
      maptaxlot: a.MAPTAXLOT || '',
    }
  } catch (e) {
    return { status: 'error', error: String(e && e.message ? e.message : e).slice(0, 120) }
  }
}
