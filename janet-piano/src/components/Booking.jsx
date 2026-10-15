import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SINGLE, PLANS, money } from '../lib/catalog'
import { useCart } from '../lib/cart'

const HOURS = [9, 10, 11, 12, 13, 14, 15, 16]
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const hourLabel = (h) => `${h % 12 || 12}${h < 12 ? 'am' : 'pm'}`

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
      <p className="eyebrow center">Book a Lesson</p>
      <h2 className="center">Pick a lesson, then a time</h2>

      <h3 className="step">1 · Choose your lesson</h3>
      <div className="grid3">
        {SINGLE.map((s) => (
          <motion.button key={s.id} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} className={`pack ${lesson.id === s.id ? 'sel' : ''}`} onClick={() => setLesson(s)} aria-pressed={lesson.id === s.id}>
            {s.popular && <span className="badge">Most popular</span>}
            <b>{s.title}</b>
            <span className="mins">{s.minutes} Minutes</span>
            <span className="price">{money(s.price)}</span>
            <small>{s.blurb}</small>
          </motion.button>
        ))}
      </div>

      <h3 className="step">2 · Pick a time</h3>
      <div className="cal">
        <div className="cal-nav">
          <button className="link" onClick={() => setWeekOffset((w) => w - 1)} disabled={weekOffset === 0} aria-label="Previous week">‹ Prev</button>
          <b>Week of {fmt(monday)}</b>
          <button className="link" onClick={() => setWeekOffset((w) => w + 1)} aria-label="Next week">Next ›</button>
        </div>
        <div className="cal-scroll">
          <div className="cal-grid" role="grid">
            <span />
            {days.map((d) => <span key={d.label} className="cal-head"><b>{d.label}</b><small>{fmt(d.date)}</small></span>)}
            {HOURS.map((h) => (
              <Row key={h} h={h} days={days} now={now} slot={slot} setSlot={setSlot} slotId={slotId} />
            ))}
          </div>
        </div>
        <p className="legend"><i className="dot gold" /> Available <i className="dot" /> Unavailable · Sample availability for this demo</p>
      </div>

      <motion.div className="summary" animate={{ opacity: slot ? 1 : 0.6 }}>
        <span>{slot ? <><b>{lesson.minutes}-minute lesson</b> · {slotText}</> : 'Select an available time above'}</span>
        <button className="btn primary" disabled={!slot} onClick={addLesson}>Add to cart · {money(lesson.price)}</button>
      </motion.div>

      <h3 className="step">Or save with a monthly program</h3>
      <div className="grid3">
        {PLANS.map((p) => (
          <div key={p.id} className="pack plan">
            {p.popular && <span className="badge">Best value</span>}
            <b>{p.title}</b>
            <span className="mins">{p.detail}</span>
            <span className="price">{money(p.price)}<small>/month</small></span>
            <button className="btn ghost sm" onClick={() => add({ uid: p.id, id: p.id, title: p.title, detail: `${p.detail} · billed monthly`, price: p.price })}>Add program</button>
          </div>
        ))}
      </div>
    </section>
  )
}

function Row({ h, days, now, slot, setSlot, slotId }) {
  return (
    <>
      <span className="cal-time">{hourLabel(h)}</span>
      {days.map(({ date }) => {
        const id = slotId(date, h)
        const when = new Date(date); when.setHours(h)
        const open = when > now && sampleOpen(date, h)
        const sel = slot === id
        return (
          <button key={id} role="gridcell" disabled={!open} className={`cell ${open ? 'open' : ''} ${sel ? 'sel' : ''}`} onClick={() => setSlot(sel ? null : id)} aria-label={`${hourLabel(h)} ${date.toDateString()} ${open ? 'available' : 'unavailable'}`}>
            {open ? (sel ? '●' : '✓') : ''}
          </button>
        )
      })}
    </>
  )
}
