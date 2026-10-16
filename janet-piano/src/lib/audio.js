import * as Tone from 'tone'

// Salamander grand piano samples. Override with VITE_SAMPLE_BASE to self-host.
const BASE = import.meta.env.VITE_SAMPLE_BASE || 'https://tonejs.github.io/audio/salamander/'

let started = false
let sampler = null
let synth = null
let samplerReady = false
const usedSampler = new Map()

function sampleUrls() {
  const urls = {}
  for (let o = 2; o <= 6; o++) {
    for (const n of ['C', 'D#', 'F#', 'A']) urls[`${n}${o}`] = `${n.replace('#', 's')}${o}.mp3`
  }
  return urls
}

// Must be called from a user gesture (pointer/key) the first time.
export function unlockAudio() {
  if (started) return
  started = true
  Tone.start().catch(() => {})
  const verb = new Tone.Freeverb({ roomSize: 0.55, dampening: 3500, wet: 0.14 })
  const limiter = new Tone.Limiter(-2).toDestination()
  verb.connect(limiter)
  // Instant fallback voice while the real samples stream in (or if offline).
  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.004, decay: 0.5, sustain: 0.15, release: 1.1 },
    volume: -9,
  }).connect(verb)
  try {
    sampler = new Tone.Sampler({
      urls: sampleUrls(),
      baseUrl: BASE,
      release: 1.2,
      onload: () => { samplerReady = true },
      onerror: () => { samplerReady = false },
    }).connect(verb)
  } catch {
    sampler = null
  }
}

export const isUsingSamples = () => samplerReady

export function playNote(note) {
  if (!started) return
  try {
    if (samplerReady && sampler) {
      usedSampler.set(note, true)
      sampler.triggerAttack(note)
    } else if (synth) {
      usedSampler.set(note, false)
      synth.triggerAttack(note)
    }
  } catch { /* audio context not ready yet */ }
}

export function stopNote(note) {
  try {
    if (usedSampler.get(note) && sampler) sampler.triggerRelease(note)
    else if (synth) synth.triggerRelease(note)
  } catch { /* ignore */ }
}
