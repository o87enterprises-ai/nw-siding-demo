import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Piano3D from './Piano3D'
import WaxSeal from './WaxSeal'
import { SONGS, noteToKeyboard, pretty } from '../lib/notes'
import { engine } from '../lib/engine'
import { enableMidi } from '../lib/midi'

export default function Hero() {
  const [mode, setMode] = useState('free') // free | learn | janet
  const [songId, setSongId] = useState(SONGS[0].id)
  const [step, setStep] = useState(0)
  const [hint, setHint] = useState('Tap, click or use your keyboard to play.')
  const [midi, setMidi] = useState('idle')
  const song = SONGS.find((s) => s.id === songId)
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
    setHint('Free play. Pick a song when you are ready.')
  }, [clearTimers])

  const startLearn = () => {
    clearTimers()
    setMode('learn')
    setStep(0)
    setHint('Press the glowing key to begin.')
  }

  const startJanet = () => {
    clearTimers()
    setMode('janet')
    setStep(0)
    setHint('Janet is playing. Join in on any key!')
    const beat = 60000 / song.bpm
    let t = 700
    song.notes.forEach(([note, beats], i) => {
      timers.current.push(setTimeout(() => { setStep(i); engine.noteOn(note, { source: 'janet', gold: true }) }, t))
      timers.current.push(setTimeout(() => engine.noteOff(note), t + beats * beat * 0.9))
      t += beats * beat
    })
    timers.current.push(setTimeout(() => { setMode('free'); setStep(0); setHint('Nicely done. Your turn: try Learn mode!') }, t + 600))
  }

  // Practice logic: correct key -> gold glow, particle burst, next note.
  const state = useRef()
  state.current = { mode, step, song }
  useEffect(() => engine.subscribe((e) => {
    const { mode, step, song } = state.current
    if (e.source !== 'user' || mode !== 'learn') return
    const target = song.notes[step][0]
    if (e.note === target) {
      engine.celebrate(e.note)
      if (step + 1 >= song.notes.length) {
        setMode('free'); setStep(0)
        setHint(`You played ${song.title}! Press Learn to go again.`)
      } else {
        setStep(step + 1)
        setHint('Great! Next note…')
      }
    } else {
      setHint(`Close! Look for ${pretty(target)} (key ${noteToKeyboard[target] || '—'}).`)
    }
  }), [])

  const target = mode !== 'free' ? song.notes[Math.min(step, song.notes.length - 1)][0] : null

  const connectMidi = async () => {
    setMidi('connecting')
    setMidi(await enableMidi())
  }

  return (
    <section className="hero" id="top">
      <div className="piano-layer">
        <Piano3D practice={practice} />
      </div>

      <div className="hero-content">
        <div className="tools">
          <div className="controls">
            <select value={songId} onChange={(e) => { stop(); setSongId(e.target.value) }} aria-label="Choose a song">
              {SONGS.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
            <button className={mode === 'learn' ? 'on' : ''} onClick={mode === 'learn' ? stop : startLearn}>
              {mode === 'learn' ? 'Stop' : 'Learn the song'}
            </button>
            <button className={mode === 'janet' ? 'on' : ''} onClick={mode === 'janet' ? stop : startJanet}>
              {mode === 'janet' ? 'Stop' : 'Play along with Janet'}
            </button>
          </div>
          <div className="piano-status" aria-live="polite">
            {target && <span className="chip">Next: <b>{pretty(target)}</b> · key {noteToKeyboard[target]}</span>}
            <span>{hint}</span>
            {mode !== 'free' && <span className="progress">{Math.min(step, song.notes.length)}/{song.notes.length}</span>}
          </div>
          <div className="piano-foot">
            <span>Keys: <kbd>Z</kbd>–<kbd>M</kbd> low octave, <kbd>Q</kbd>–<kbd>I</kbd> high octave</span>
            {'requestMIDIAccess' in navigator && (
              <button className="link" onClick={connectMidi} disabled={midi === 'ready'}>
                {midi === 'ready' ? 'MIDI keyboard connected' : midi === 'denied' ? 'MIDI unavailable' : 'Connect a MIDI keyboard'}
              </button>
            )}
          </div>
        </div>

        <div className="hero-center">
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="hero-seal-wrap">
            <WaxSeal size="100%" className="hero-seal" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <h1>Learn Piano <em>With Janet</em></h1>
            <div className="cta-row">
              <a className="btn primary" href="#book">Book a Lesson</a>
              <a className="btn ghost" href="#about">Learn More</a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
