import { useCallback, useEffect, useRef, useState } from 'react'
import { engine } from './engine'
import { centsFromTarget } from './pitch'

const IN_TUNE_CENTS = 35 // a note counts as sung well within this many cents (any octave)

// Singalong session: the piano plays/lights each note (the guide), lyrics advance, and the mic is scored per note.
export function useSing(song, mic, { guide = true } = {}) {
  const [state, setState] = useState('idle') // idle | running | done
  const [index, setIndex] = useState(-1)
  const [result, setResult] = useState(null)
  const [hint, setHint] = useState('')
  const timers = useRef([])
  const cur = useRef(null) // { note, start, end }
  const stats = useRef({ frames: 0, good: 0 })

  // The 3D lane reads this ref every frame.
  const practice = useRef({ active: false, step: 0, notes: song.notes })
  practice.current = { active: state === 'running', step: Math.max(0, index), notes: song.notes }

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    cur.current = null
    engine.releaseAll()
  }, [])
  useEffect(() => clear, [clear])

  const stop = useCallback(() => {
    clear()
    setState('idle')
    setIndex(-1)
    setHint('')
  }, [clear])
  useEffect(() => { stop(); setResult(null) }, [song.id, stop])

  // Score microphone frames against the current note (skip the first 250 ms so singers can find the pitch).
  useEffect(() => mic.subscribe(({ freq }) => {
    const c = cur.current
    if (!c) return
    const now = performance.now()
    if (now < c.start + 250 || now > c.end) return
    stats.current.frames++
    if (freq && Math.abs(centsFromTarget(freq, c.note)) <= IN_TUNE_CENTS) stats.current.good++
  }), [mic.subscribe])

  const start = useCallback(async () => {
    clear()
    setResult(null)
    if (!(await mic.start())) return
    stats.current = { frames: 0, good: 0 }
    setState('running')
    setIndex(-1)
    setHint('Get ready…')
    const beat = 60000 / song.bpm
    let t = 1800
    song.notes.forEach(([note, beats], i) => {
      const dur = beats * beat
      timers.current.push(setTimeout(() => {
        setIndex(i)
        setHint('Sing!')
        cur.current = { note, start: performance.now(), end: performance.now() + dur * 0.95 }
        if (guide) engine.noteOn(note, { source: 'janet', gold: true })
        else engine.celebrate(note)
      }, t))
      if (guide) timers.current.push(setTimeout(() => engine.noteOff(note), t + dur * 0.9))
      t += dur
    })
    timers.current.push(setTimeout(() => {
      cur.current = null
      const { frames, good } = stats.current
      const accuracy = frames ? good / frames : 0
      setResult({ accuracy, frames })
      setState('done')
      setIndex(-1)
      setHint('')
    }, t + 300))
  }, [clear, mic.start, song, guide])

  return { state, running: state === 'running', index, result, hint, practice, start, stop, currentNote: cur }
}
