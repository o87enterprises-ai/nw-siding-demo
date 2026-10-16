import { playNote, stopNote, unlockAudio } from './audio'

// Shared, framework-free piano state. The 3D scene reads it every frame
// (no React re-renders per key), UI code subscribes to events.
class PianoEngine {
  active = new Map() // note -> number of holders (mouse, touch, keyboard, MIDI, Janet)
  gold = new Map() // note -> timestamp until which the key glows gold
  pendingBursts = []
  listeners = new Set()

  subscribe(fn) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  noteOn(note, { source = 'user', gold = false } = {}) {
    unlockAudio()
    this.active.set(note, (this.active.get(note) || 0) + 1)
    playNote(note)
    if (gold) this.celebrate(note)
    this.listeners.forEach((fn) => fn({ type: 'on', note, source }))
  }

  noteOff(note) {
    const n = this.active.get(note) || 0
    if (n <= 1) {
      this.active.delete(note)
      stopNote(note)
    } else this.active.set(note, n - 1)
  }

  celebrate(note) {
    this.gold.set(note, performance.now() + 450)
    this.pendingBursts.push(note)
  }

  releaseAll() {
    for (const note of this.active.keys()) stopNote(note)
    this.active.clear()
  }
}

export const engine = new PianoEngine()
