// Monophonic pitch detection (YIN) plus note/cents helpers for the vocal tuner.
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export function hzToMidi(hz) { return 69 + 12 * Math.log2(hz / 440) }
export function midiToHz(m) { return 440 * Math.pow(2, (m - 69) / 12) }
export function midiToName(m) { const r = Math.round(m); return `${NAMES[((r % 12) + 12) % 12]}${Math.floor(r / 12) - 1}` }
export function noteToMidi(note) {
  const m = /^([A-G]#?)(-?\d)$/.exec(note)
  return NAMES.indexOf(m[1]) + (Number(m[2]) + 1) * 12
}
export const noteToHz = (note) => midiToHz(noteToMidi(note))

// Cents of `hz` relative to a target note, folded into [-600, 600) so a singer in any octave can match it.
export function centsFromTarget(hz, targetNote) {
  const c = 1200 * Math.log2(hz / noteToHz(targetNote))
  return ((((c + 600) % 1200) + 1200) % 1200) - 600
}
// Cents from the nearest equal-tempered semitone (free-tuner mode).
export function centsFromNearest(hz) {
  const m = hzToMidi(hz)
  return (m - Math.round(m)) * 100
}

// YIN (de Cheveigné & Kawahara). Returns { freq, clarity, rms } or null when silent/unvoiced.
export function detectPitch(buf, sampleRate, { minHz = 70, maxHz = 1100, threshold = 0.12, gate = 0.008 } = {}) {
  const n = buf.length
  const half = n >> 1
  let sum = 0
  for (let i = 0; i < n; i++) sum += buf[i] * buf[i]
  const rms = Math.sqrt(sum / n)
  if (rms < gate) return null

  const tauMax = Math.min(half - 1, Math.floor(sampleRate / minHz))
  const tauMin = Math.max(2, Math.floor(sampleRate / maxHz))
  const d = new Float32Array(tauMax + 2)
  for (let tau = 1; tau <= tauMax; tau++) {
    let s = 0
    for (let i = 0; i < half; i++) { const x = buf[i] - buf[i + tau]; s += x * x }
    d[tau] = s
  }
  const cm = new Float32Array(tauMax + 2)
  cm[0] = 1
  let run = 0
  for (let tau = 1; tau <= tauMax; tau++) { run += d[tau]; cm[tau] = run === 0 ? 1 : (d[tau] * tau) / run }

  let tau = -1
  for (let t = tauMin; t <= tauMax; t++) {
    if (cm[t] < threshold) {
      while (t + 1 <= tauMax && cm[t + 1] < cm[t]) t++
      tau = t
      break
    }
  }
  if (tau < 0) return null
  const a = cm[tau - 1], b = cm[tau], c = cm[Math.min(tau + 1, tauMax)]
  const denom = 2 * (2 * b - c - a)
  const better = denom !== 0 ? tau + (c - a) / denom : tau
  return { freq: sampleRate / better, clarity: 1 - b, rms }
}
