import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Piano3D from './Piano3D'
import WaxSeal from './WaxSeal'
import { Link } from '../lib/router'
import { SONGS, noteToKeyboard, pretty } from '../lib/notes'
import { engine } from '../lib/engine'

const song = SONGS[0]

export default function Hero() {
  const [mode, setMode] = useState('free') // free | learn | janet
  const [step, setStep] = useState(0)
  const [hint, setHint] = useState('Play the keys.')
  const timers = useRef([])

  // The 3D scene reads this ref every frame.
  const practice = useRef({ active: false, step: 0, notes: song.notes })
  practice.current = { active: mode !== 'free', step, notes: song.notes }

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    engine.releaseAll()
  }, [])
  useEffect(() => clearTimers, [clearTimers])

  const stop = useCallback(() => {
    clearTimers()
    setMode('free')
    setStep(0)
    setHint('Play the keys.')
  }, [clearTimers])

  const startLearn = () => {
    clearTimers()
    setMode('learn')
    setStep(0)
    setHint('Press the red note.')
  }

  const startJanet = () => {
    clearTimers()
    setMode('janet')
    setStep(0)
    setHint('Join in.')
    const beat = 60000 / song.bpm
    let t = 700
    song.notes.forEach(([note, beats], i) => {
      timers.current.push(setTimeout(() => { setStep(i); engine.noteOn(note, { source: 'janet', gold: true }) }, t))
      timers.current.push(setTimeout(() => engine.noteOff(note), t + beats * beat * 0.9))
      t += beats * beat
    })
    timers.current.push(setTimeout(() => { setMode('free'); setStep(0); setHint('Your turn.') }, t + 600))
  }

  // Correct key -> red glow, particle burst, next note.
  const state = useRef()
  state.current = { mode, step }
  useEffect(() => engine.subscribe((e) => {
    const { mode, step } = state.current
    if (e.source !== 'user' || mode !== 'learn') return
    const target = song.notes[step][0]
    if (e.note === target) {
      engine.celebrate(e.note)
      if (step + 1 >= song.notes.length) { setMode('free'); setStep(0); setHint('Well played.') }
      else { setStep(step + 1); setHint('Nice.') }
    } else {
      setHint(`Try ${pretty(target)}.`)
    }
  }), [])

  const target = mode !== 'free' ? song.notes[Math.min(step, song.notes.length - 1)][0] : null

  return (
    <section className="hero" id="top">
      <div className="piano-layer">
        <Piano3D practice={practice} />
      </div>

      <div className="hero-content">
        <div className="tools">
          <div className="controls">
            <button className={mode === 'learn' ? 'on' : ''} onClick={mode === 'learn' ? stop : startLearn}>
              {mode === 'learn' ? 'Stop' : 'Learn'}
            </button>
            <button className={mode === 'janet' ? 'on' : ''} onClick={mode === 'janet' ? stop : startJanet}>
              {mode === 'janet' ? 'Stop' : 'Play along'}
            </button>
          </div>
          <p className="piano-status" aria-live="polite">
            {target && <span className="chip">{pretty(target)} <kbd>{noteToKeyboard[target]}</kbd></span>}
            {hint}
          </p>
        </div>

        <div className="hero-center">
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="hero-seal-wrap">
            <WaxSeal size="100%" className="hero-seal" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <h1>Learn piano with Janet</h1>
            <Link className="btn primary" to="/book">Book a lesson</Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
