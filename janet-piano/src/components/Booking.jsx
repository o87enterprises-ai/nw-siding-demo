import { useMemo, useState } from 'react'
import { SINGLE, PLANS, money } from '../lib/catalog'
import { useCart } from '../lib/cart'

const HOURS = [9, 10, 11, 12, 13, 14, 15, 16]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const hourLabel = (h) => `${h % 12 || 12}${h < 12 ? 'am' : 'pm'}`
const hourPlain = (h) => String(h % 12 || 12)

function mondayOf(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  const day = x.getDay() // weekend -> show next week
  x.setDate(x.getDate() + (day === 0 ? 1 : day === 6 ? 2 : 1 - day))
  return x
}
// Deterministic sample availability (real data comes from the Availability table).
function sampleOpen(date, hour) {
  const n = date.getFullYear() * 1000 + date.getMonth() * 50 + date.getDate() * 7 + hour * 13
  return ((Math.sin(n) * 10000) % 1 + 1) % 1 > 0.42
}

export default function Booking() {
  const { add } = useCart()
  const [lesson, setLesson] = useState(SINGLE[1])
  const [weekOffset, setWeekOffset] = useState(0)
  const [slot, setSlot] = useState(null)
  const monday = useMemo(() => {
    const m = mondayOf(new Date())
    m.setDate(m.getDate() + weekOffset * 7)
    return m
  }, [weekOffset])
  const now = new Date()

  const days = DAYS.map((label, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return { label, date: d }
  })
  const fmt = (d) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  const slotId = (d, h) => `${d.toISOString().slice(0, 10)}T${String(h).padStart(2, '0')}:00`
  const slotText = slot && `${new Date(slot).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} at ${hourLabel(+slot.slice(11, 13))}`

  const addLesson = () => {
    add({ uid: `${lesson.id}@${slot}`, id: lesson.id, slot, title: `${lesson.minutes} Min Lesson`, detail: slotText, price: lesson.price })
    setSlot(null)
  }

  return (
    <section className="section" id="book">
      <div className="lessons" role="group" aria-label="Lesson length">
        {SINGLE.map((s) => (
          <button key={s.id} className={`pill ${lesson.id === s.id ? 'sel' : ''}`} onClick={() => setLesson(s)} aria-pressed={lesson.id === s.id}>
            {s.minutes} min {money(s.price)}
          </button>
        ))}
      </div>

      <div className="cal">
        <div className="cal-nav">
          <button className="link" onClick={() => setWeekOffset((w) => w - 1)} disabled={weekOffset === 0} aria-label="Previous week">‹</button>
          <span>{fmt(monday)}</span>
          <button className="link" onClick={() => setWeekOffset((w) => w + 1)} aria-label="Next week">›</button>
        </div>
        <div className="cal-scroll">
          <div className="cal-grid" role="grid">
            <span />
            {days.map((d) => <span key={d.label} className="cal-head">{d.label}</span>)}
            {HOURS.map((h) => (
              <Row key={h} h={h} days={days} now={now} slot={slot} setSlot={setSlot} slotId={slotId} />
            ))}
          </div>
        </div>
      </div>

      <button className="btn primary" disabled={!slot} onClick={addLesson}>Add to cart</button>

      <div className="lessons plans" role="group" aria-label="Monthly programs">
        <span>Monthly</span>
        {PLANS.map((p) => (
          <button key={p.id} className="pill" onClick={() => add({ uid: p.id, id: p.id, title: p.title, detail: `${p.detail} · billed monthly`, price: p.price })}>
            {p.short} {money(p.price)}
          </button>
        ))}
      </div>
    </section>
  )
}

function Row({ h, days, now, slot, setSlot, slotId }) {
  return (
    <>
      <span className="cal-time">{hourPlain(h)}</span>
      {days.map(({ date }) => {
        const id = slotId(date, h)
        const when = new Date(date); when.setHours(h)
        const open = when > now && sampleOpen(date, h)
        const sel = slot === id
        return (
          <button key={id} role="gridcell" disabled={!open} className={`cell ${open ? 'open' : ''} ${sel ? 'sel' : ''}`} onClick={() => setSlot(sel ? null : id)} aria-label={`${hourLabel(h)} ${date.toDateString()} ${open ? 'available' : 'unavailable'}`}>
            
          </button>
        )
      })}
    </>
  )
}
