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

  const pending = useRef(null)

  const start = useCallback(() => {
    if (ctx.current) return Promise.resolve(true)
    if (pending.current) return pending.current // a second tap while the permission prompt is open
    if (!navigator.mediaDevices?.getUserMedia) {
      const inApp = /FBAN|FBAV|Instagram|Line\/|MicroMessenger|Snapchat|TikTok/i.test(navigator.userAgent)
      setUi((u) => ({ ...u, error: inApp ? 'Open this page in Safari or Chrome to use the microphone.' : 'This browser cannot use the microphone.' }))
      return Promise.resolve(false)
    }
    // Create and resume the audio context RIGHT NOW, inside the tap. iOS Safari only lets it run if it is
    // started during the gesture, not after the permission prompt resolves.
    const AC = window.AudioContext || window.webkitAudioContext
    const c = new AC()
    c.resume().catch(() => {})

    pending.current = (async () => {
      let media
      try {
        media = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        })
      } catch (e) {
        c.close().catch(() => {})
        const name = e && e.name
        setUi((u) => ({
          ...u,
          error: name === 'NotAllowedError' || name === 'PermissionDeniedError' || name === 'SecurityError'
            ? 'Microphone is blocked. Allow it in your browser, then press play.'
            : name === 'NotFoundError' || name === 'OverconstrainedError' ? 'No microphone found.'
            : name === 'NotReadableError' ? 'Another app is using the microphone.'
            : 'Could not start the microphone.',
        }))
        return false
      }
      stream.current = media
      ctx.current = c
      // Never wait forever on a suspended context; it is resumed again on the next tap if needed.
      if (c.state === 'suspended') await Promise.race([c.resume().catch(() => {}), new Promise((r) => setTimeout(r, 800))])
      const resumeOnTap = () => { if (c.state === 'suspended') c.resume().catch(() => {}) }
      document.addEventListener('pointerdown', resumeOnTap, { once: true })

      const analyser = c.createAnalyser()
      analyser.fftSize = 2048
      c.createMediaStreamSource(media).connect(analyser)
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
        if (sample.t - last.current.at > 50) { last.current = { freq, level, at: sample.t }; setUi({ listening: true, error: '', freq, level }) }
        raf.current = requestAnimationFrame(tick)
      }
      setUi({ listening: true, error: '', freq: null, level: 0 })
      raf.current = requestAnimationFrame(tick)
      return true
    })().finally(() => { pending.current = null })
    return pending.current
  }, [])

  const subscribe = useCallback((fn) => { listeners.current.add(fn); return () => listeners.current.delete(fn) }, [])
  return { ...ui, start, stop, subscribe }
}
