import { motion } from 'framer-motion'
import { engine } from '../lib/engine'

const STEPS = [
  ['Intro', 'C4'],
  ['Reading', 'D4'],
  ['Technique', 'E4'],
  ['Performance', 'G4'],
  ['Repertoire', 'A4'],
]

export default function Path() {
  return (
    <section className="section" id="path">
      <ol className="path">
        {STEPS.map(([label, note], i) => (
          <motion.li key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
            <button
              className="note-orb"
              aria-label={`Play ${label}`}
              onPointerDown={() => engine.noteOn(note, { source: 'ui' })}
              onPointerUp={() => engine.noteOff(note)}
              onPointerLeave={() => engine.noteOff(note)}
            >
              <svg viewBox="0 0 40 60" width="26" height="40" aria-hidden="true">
                <ellipse cx="14" cy="46" rx="11" ry="8" transform="rotate(-20 14 46)" fill="currentColor" />
                <rect x="23" y="6" width="3.5" height="40" fill="currentColor" />
                <path d="M26 6c8 4 12 10 8 20 2-8-2-12-8-14z" fill="currentColor" />
              </svg>
            </button>
            <span>{label}</span>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
