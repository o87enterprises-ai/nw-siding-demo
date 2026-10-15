import { engine } from './engine'

const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const midiToNote = (n) => `${NAMES[n % 12]}${Math.floor(n / 12) - 1}`
let connected = false

// Optional Web MIDI input. Notes outside C4-C6 still sound, they just have no 3D key.
export async function enableMidi() {
  if (connected) return 'ready'
  try {
    const access = await navigator.requestMIDIAccess()
    const hook = (input) => {
      input.onmidimessage = ({ data: [status, note, vel] }) => {
        const cmd = status & 0xf0
        if (cmd === 0x90 && vel > 0) engine.noteOn(midiToNote(note), { source: 'user' })
        else if (cmd === 0x80 || (cmd === 0x90 && vel === 0)) engine.noteOff(midiToNote(note))
      }
    }
    access.inputs.forEach(hook)
    access.onstatechange = () => access.inputs.forEach(hook)
    connected = true
    return 'ready'
  } catch {
    return 'denied'
  }
}
