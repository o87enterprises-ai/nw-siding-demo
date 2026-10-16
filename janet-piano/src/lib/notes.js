// Two-octave keyboard, C4 to C6.
const WHITES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const HAS_BLACK_AFTER = new Set(['C', 'D', 'F', 'G', 'A'])

function build() {
  const keys = []
  let w = 0
  for (const oct of [4, 5]) {
    for (const n of WHITES) {
      keys.push({ note: `${n}${oct}`, x: w, black: false })
      if (HAS_BLACK_AFTER.has(n)) keys.push({ note: `${n}#${oct}`, x: w + 0.5, black: true })
      w++
    }
  }
  keys.push({ note: 'C6', x: w, black: false })
  const mid = w / 2
  return keys.map((k) => ({ ...k, x: k.x - mid }))
}

export const KEYS = build()
export const KEY_WIDTH_TOTAL = 15
export const noteToX = Object.fromEntries(KEYS.map((k) => [k.note, k.x]))

// Computer keyboard layout (two piano-style rows).
export const KEYBOARD_MAP = {
  z: 'C4', s: 'C#4', x: 'D4', d: 'D#4', c: 'E4', v: 'F4', g: 'F#4', b: 'G4', h: 'G#4', n: 'A4', j: 'A#4', m: 'B4',
  q: 'C5', 2: 'C#5', w: 'D5', 3: 'D#5', e: 'E5', r: 'F5', 5: 'F#5', t: 'G5', 6: 'G#5', y: 'A5', 7: 'A#5', u: 'B5', i: 'C6',
}
export const noteToKeyboard = Object.fromEntries(Object.entries(KEYBOARD_MAP).map(([k, n]) => [n, k.toUpperCase()]))

export const pretty = (note) => note.replace(/\d/, '').replace('#', '♯')

// [note, beats]
export const SONGS = [
  {
    id: 'mary',
    title: 'Mary Had A Little Lamb',
    bpm: 100,
    notes: [
      ['E4', 1, 'Ma'], ['D4', 1, 'ry'], ['C4', 1, 'had'], ['D4', 1, 'a'], ['E4', 1, 'lit'], ['E4', 1, 'tle'], ['E4', 2, 'lamb'], ['D4', 1, 'lit'], ['D4', 1, 'tle'], ['D4', 2, 'lamb'], ['E4', 1, 'lit'], ['G4', 1, 'tle'], ['G4', 2, 'lamb'], ['E4', 1, 'Ma'], ['D4', 1, 'ry'], ['C4', 1, 'had'], ['D4', 1, 'a'], ['E4', 1, 'lit'], ['E4', 1, 'tle'], ['E4', 1, 'lamb'], ['E4', 1, 'its'], ['D4', 1, 'fleece'], ['D4', 1, 'was'], ['E4', 1, 'white'], ['D4', 1, 'as'], ['C4', 4, 'snow']
    ],
  },
  {
    id: 'twinkle',
    title: 'Twinkle, Twinkle, Little Star',
    bpm: 100,
    notes: [
      ['C4', 1, 'Twin'], ['C4', 1, 'kle'], ['G4', 1, 'twin'], ['G4', 1, 'kle'], ['A4', 1, 'lit'], ['A4', 1, 'tle'], ['G4', 2, 'star'], ['F4', 1, 'how'], ['F4', 1, 'I'], ['E4', 1, 'won'], ['E4', 1, 'der'], ['D4', 1, 'what'], ['D4', 1, 'you'], ['C4', 2, 'are']
    ],
  },
  {
    id: 'ode',
    title: 'Ode to Joy',
    bpm: 100,
    notes: [
      ['E4', 1, 'la'], ['E4', 1, 'la'], ['F4', 1, 'la'], ['G4', 1, 'la'], ['G4', 1, 'la'], ['F4', 1, 'la'], ['E4', 1, 'la'], ['D4', 1, 'la'], ['C4', 1, 'la'], ['C4', 1, 'la'], ['D4', 1, 'la'], ['E4', 1, 'la'], ['E4', 1.5, 'la'], ['D4', 0.5, 'la'], ['D4', 2, 'la']
    ],
  },
  {
    id: 'bun',
    title: 'Hot Cross Buns',
    bpm: 100,
    notes: [
      ['E4', 1, 'Hot'], ['D4', 1, 'cross'], ['C4', 2, 'buns'], ['E4', 1, 'hot'], ['D4', 1, 'cross'], ['C4', 2, 'buns'], ['C4', 0.5, 'one'], ['C4', 0.5, 'a'], ['C4', 0.5, 'pen'], ['C4', 0.5, 'ny'], ['D4', 0.5, 'two'], ['D4', 0.5, 'a'], ['D4', 0.5, 'pen'], ['D4', 0.5, 'ny'], ['E4', 1, 'hot'], ['D4', 1, 'cross'], ['C4', 2, 'buns']
    ],
  },
]
