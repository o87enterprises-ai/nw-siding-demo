import { motion } from 'framer-motion'
import { engine } from '../lib/engine'

const STEPS = [
  { title: 'Intro Piano', note: 'C4', text: 'Find middle C, learn finger numbers and play your first songs by ear and by pattern.' },
  { title: 'Reading Music', note: 'D4', text: 'Treble and bass clef, rhythm and note values. Turn the page into sound.' },
  { title: 'Technique', note: 'E4', text: 'Scales, arpeggios and hand position for fluid, relaxed playing.' },
  { title: 'Performance', note: 'G4', text: 'Shape phrases, manage nerves and share your music at recitals.' },
  { title: 'Advanced Repertoire', note: 'A4', text: 'Take on larger works and develop your own musical voice.' },
]

export default function Path() {
  return (
    <section className="section" id="path">
      <p className="eyebrow center">The Learning Path</p>
      <h2 className="center">From first note to full repertoire</h2>
      <p className="center sub">Tap a glowing note to hear each milestone.</p>
      <ol className="path">
        {STEPS.map((s, i) => (
          <motion.li key={s.title} className={i % 2 ? 'right' : 'left'} initial={{ opacity: 0, x: i % 2 ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7 }}>
            <button
              className="note-orb"
              aria-label={`Play ${s.title} note`}
              onPointerDown={() => engine.noteOn(s.note, { source: 'ui' })}
              onPointerUp={() => engine.noteOff(s.note)}
              onPointerLeave={() => engine.noteOff(s.note)}
            >
              <svg viewBox="0 0 40 60" width="34" height="50" aria-hidden="true">
                <ellipse cx="14" cy="46" rx="11" ry="8" transform="rotate(-20 14 46)" fill="currentColor" />
                <rect x="23" y="6" width="3.5" height="40" fill="currentColor" />
                <path d="M26 6c8 4 12 10 8 20 2-8-2-12-8-14z" fill="currentColor" />
              </svg>
            </button>
            <div className="path-card">
              <span className="num">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
