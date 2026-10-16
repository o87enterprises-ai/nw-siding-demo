import { useCallback, useEffect, useRef, useState } from 'react'
import { detectPitch } from './pitch'

// Microphone pitch tracking. Audio never leaves the device: it is analysed locally in the browser.
// Echo cancellation / noise suppression are off so the voice is not "corrected" before we measure it.
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[s.length >> 1] }

export function useMic() {
  const [ui, setUi] = useState({ listening: false, error: '', freq: null, level: 0 })
  const ctx = useRef(null)
  const stream = useRef(null)
  const raf = useRef(0)
  const listeners = useRef(new Set())
  const last = useRef({ freq: null, level: 0, at: 0 })

  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current)
    stream.current?.getTracks().forEach((t) => t.stop())
    ctx.current?.close().catch(() => {})
    stream.current = null
    ctx.current = null
    setUi({ listening: false, error: '', freq: null, level: 0 })
  }, [])
  useEffect(() => stop, [stop])

  const start = useCallback(async () => {
    if (ctx.current) return true
    if (!navigator.mediaDevices?.getUserMedia) {
      setUi((u) => ({ ...u, error: 'This browser cannot use the microphone.' }))
      return false
    }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
    } catch {
      setUi((u) => ({ ...u, error: 'Microphone blocked. Allow it in your browser settings and try again.' }))
      return false
    }
    const AC = window.AudioContext || window.webkitAudioContext
    const c = new AC()
    await c.resume().catch(() => {})
    const analyser = c.createAnalyser()
    analyser.fftSize = 2048
    c.createMediaStreamSource(stream.current).connect(analyser)
    ctx.current = c

    const buf = new Float32Array(analyser.fftSize)
    const hist = []
    let misses = 0
    const tick = () => {
      analyser.getFloatTimeDomainData(buf)
      const r = detectPitch(buf, c.sampleRate)
      let freq = null
      if (r && r.clarity > 0.8) {
        hist.push(r.freq)
        if (hist.length > 5) hist.shift()
        misses = 0
        freq = median(hist)
      } else if (++misses < 4 && hist.length) {
        freq = median(hist) // bridge tiny dropouts
      } else {
        hist.length = 0
      }
      const level = Math.min(1, (r ? r.rms : 0) * 8)
      const sample = { freq, level, t: performance.now() }
      listeners.current.forEach((fn) => fn(sample))
      const now = sample.t
      if (now - last.current.at > 50) { last.current = { freq, level, at: now }; setUi({ listening: true, error: '', freq, level }) }
      raf.current = requestAnimationFrame(tick)
    }
    setUi({ listening: true, error: '', freq: null, level: 0 })
    raf.current = requestAnimationFrame(tick)
    return true
  }, [])

  const subscribe = useCallback((fn) => { listeners.current.add(fn); return () => listeners.current.delete(fn) }, [])
  return { ...ui, start, stop, subscribe }
}
