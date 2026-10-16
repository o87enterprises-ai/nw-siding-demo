import { useCallback, useEffect, useRef, useState } from 'react'
import { engine } from './engine'
import { pretty } from './notes'

// Shared lesson logic: "learn" (student plays the lit key) and "janet" (Janet plays, keys light up).
export function usePractice(song) {
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

  // Switching songs resets everything.
  useEffect(() => { stop() }, [song.id, stop])

  const startLearn = useCallback(() => {
    clearTimers()
    setMode('learn')
    setStep(0)
    setHint('Press the red note.')
  }, [clearTimers])

  const startJanet = useCallback(() => {
    clearTimers()
    setMode('janet')
    setStep(0)
    setHint('Watch my keys.')
    const beat = 60000 / song.bpm
    let t = 700
    song.notes.forEach(([note, beats], i) => {
      timers.current.push(setTimeout(() => { setStep(i); engine.noteOn(note, { source: 'janet', gold: true }) }, t))
      timers.current.push(setTimeout(() => engine.noteOff(note), t + beats * beat * 0.9))
      t += beats * beat
    })
    timers.current.push(setTimeout(() => { setMode('free'); setStep(0); setHint('Your turn.') }, t + 600))
  }, [clearTimers, song])

  // Correct key -> red glow, particle burst, next note.
  const state = useRef()
  state.current = { mode, step, song }
  useEffect(() => engine.subscribe((e) => {
    const { mode, step, song } = state.current
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
  return { mode, step, hint, target, practice, startLearn, startJanet, stop }
}
