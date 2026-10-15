import { useMemo, useState } from 'react'
import { SINGLE, PLANS, money } from '../lib/catalog'
import { useCart } from '../lib/cart'
import { Link } from '../lib/router'
import WaxSeal from './WaxSeal'

const HOURS = [9, 10, 11, 12, 13, 14, 15, 16]
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const hourLabel = (h) => `${h % 12 || 12}:00 ${h < 12 ? 'am' : 'pm'}`
const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// Deterministic sample availability (real data comes from the Availability table).
function sampleOpen(date, hour) {
  const n = date.getFullYear() * 1000 + date.getMonth() * 50 + date.getDate() * 7 + hour * 13
  return ((Math.sin(n) * 10000) % 1 + 1) % 1 > 0.42
}
function openHours(date, now) {
  const dow = date.getDay()
  if (dow === 0 || dow === 6) return []
  return HOURS.filter((h) => {
    const t = new Date(date); t.setHours(h, 0, 0, 0)
    return t > now && sampleOpen(date, h)
  })
}

export default function BookingPage() {
  const { add } = useCart()
  const now = useMemo(() => new Date(), [])
  const [lesson, setLesson] = useState(SINGLE[1])
  const [month, setMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1))
  const [day, setDay] = useState(null) // Date
  const [hour, setHour] = useState(null)

  const cells = useMemo(() => {
    const first = month.getDay()
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    return [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))]
  }, [month])

  const hours = day ? openHours(day, now) : []
  const atCurrentMonth = month.getFullYear() === now.getFullYear() && month.getMonth() === now.getMonth()
  const shift = (n) => { setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1)); setDay(null); setHour(null) }

  const addLesson = () => {
    const slot = `${dayKey(day)}T${String(hour).padStart(2, '0')}:00`
    const when = `${day.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} at ${hourLabel(hour)}`
    add({ uid: `${lesson.id}@${slot}`, id: lesson.id, slot, title: `${lesson.minutes} Min Lesson`, detail: when, price: lesson.price })
    setHour(null)
  }

  return (
    <main className="book-page">
      <Link to="/" className="book-home" aria-label="Home"><WaxSeal size={64} /></Link>

      <div className="lessons" role="group" aria-label="Lesson length">
        {SINGLE.map((s) => (
          <button key={s.id} className={`pill ${lesson.id === s.id ? 'sel' : ''}`} onClick={() => setLesson(s)} aria-pressed={lesson.id === s.id}>
            {s.minutes} min {money(s.price)}
          </button>
        ))}
      </div>

      <div className="month">
        <div className="month-head">
          <button className="arrow" onClick={() => shift(-1)} disabled={atCurrentMonth} aria-label="Previous month">‹</button>
          <h2>{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2>
          <button className="arrow" onClick={() => shift(1)} aria-label="Next month">›</button>
        </div>
        <div className="month-grid" role="grid">
          {WEEKDAYS.map((w, i) => <span key={i} className="dow">{w}</span>)}
          {cells.map((d, i) => {
            if (!d) return <span key={`b${i}`} />
            const avail = openHours(d, now).length > 0
            const sel = day && dayKey(day) === dayKey(d)
            const today = dayKey(d) === dayKey(now)
            return (
              <button key={i} role="gridcell" disabled={!avail} aria-label={d.toDateString()} aria-selected={!!sel}
                className={`day ${avail ? 'avail' : ''} ${sel ? 'sel' : ''} ${today ? 'today' : ''}`}
                onClick={() => { setDay(d); setHour(null) }}>
                {d.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {day && (
        <div className="times">
          {hours.map((h) => (
            <button key={h} className={`pill ${hour === h ? 'sel' : ''}`} onClick={() => setHour(h)} aria-pressed={hour === h}>{hourLabel(h)}</button>
          ))}
        </div>
      )}

      <button className="btn primary" disabled={!day || hour == null} onClick={addLesson}>Add to cart</button>

      <div className="lessons plans" role="group" aria-label="Monthly programs">
        <span>Monthly</span>
        {PLANS.map((p) => (
          <button key={p.id} className="pill" onClick={() => add({ uid: p.id, id: p.id, title: p.title, detail: `${p.detail} · billed monthly`, price: p.price })}>
            {p.short} {money(p.price)}
          </button>
        ))}
      </div>
    </main>
  )
}
