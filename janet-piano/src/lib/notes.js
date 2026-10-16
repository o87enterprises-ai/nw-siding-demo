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
      ['E4', 1], ['D4', 1], ['C4', 1], ['D4', 1], ['E4', 1], ['E4', 1], ['E4', 2],
      ['D4', 1], ['D4', 1], ['D4', 2], ['E4', 1], ['G4', 1], ['G4', 2],
      ['E4', 1], ['D4', 1], ['C4', 1], ['D4', 1], ['E4', 1], ['E4', 1], ['E4', 1], ['E4', 1],
      ['D4', 1], ['D4', 1], ['E4', 1], ['D4', 1], ['C4', 4],
    ],
  },
  {
    id: 'twinkle',
    title: 'Twinkle, Twinkle, Little Star',
    bpm: 100,
    notes: [
      ['C4', 1], ['C4', 1], ['G4', 1], ['G4', 1], ['A4', 1], ['A4', 1], ['G4', 2],
      ['F4', 1], ['F4', 1], ['E4', 1], ['E4', 1], ['D4', 1], ['D4', 1], ['C4', 2],
    ],
  },
  {
    id: 'ode',
    title: 'Ode to Joy',
    bpm: 100,
    notes: [
      ['E4', 1], ['E4', 1], ['F4', 1], ['G4', 1], ['G4', 1], ['F4', 1], ['E4', 1], ['D4', 1],
      ['C4', 1], ['C4', 1], ['D4', 1], ['E4', 1], ['E4', 1.5], ['D4', 0.5], ['D4', 2],
    ],
  },
  {
    id: 'bun',
    title: 'Hot Cross Buns',
    bpm: 100,
    notes: [
      ['E4', 1], ['D4', 1], ['C4', 2], ['E4', 1], ['D4', 1], ['C4', 2],
      ['C4', 0.5], ['C4', 0.5], ['C4', 0.5], ['C4', 0.5], ['D4', 0.5], ['D4', 0.5], ['D4', 0.5], ['D4', 0.5],
      ['E4', 1], ['D4', 1], ['C4', 2],
    ],
  },
]
