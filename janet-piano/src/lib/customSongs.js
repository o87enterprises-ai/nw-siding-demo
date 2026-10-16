import { useCallback, useEffect, useState } from 'react'

// PREVIEW ONLY. Real YouTube analysis (audio extraction, melody tracking, lyric alignment) needs a server;
// see docs/VOCAL.md. This mock produces a deterministic placeholder melody so the whole flow can be tried.
const KEY = 'janet-songs-v1'
const SCALE = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4']

export function parseYouTubeId(input) {
  const s = String(input || '').trim()
  const m = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/.exec(s)
  return m ? m[1] : null
}

function rng(seed) {
  let h = 2166136261
  for (const ch of seed) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) }
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000 }
}

function mockMelody(id) {
  const r = rng(id)
  let deg = 2
  const notes = []
  for (let i = 0; i < 16; i++) {
    const step = r() < 0.55 ? (r() < 0.5 ? -1 : 1) : r() < 0.5 ? 0 : (r() < 0.5 ? -2 : 2)
    deg = Math.max(0, Math.min(SCALE.length - 1, deg + step))
    notes.push([i === 15 ? 'C4' : SCALE[deg], i % 5 === 4 ? 2 : 1, 'la'])
  }
  return { bpm: 84 + Math.floor(r() * 24), notes }
}

const wait = (ms) => new Promise((res) => setTimeout(res, ms))

async function fetchTitle(url) {
  try {
    const ctl = new AbortController()
    const t = setTimeout(() => ctl.abort(), 3500)
    const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`, { signal: ctl.signal })
    clearTimeout(t)
    if (!res.ok) return null
    return (await res.json()).title || null
  } catch { return null }
}

// onStep receives progress labels. Resolves to a song object.
export async function analyzeYouTube(url, onStep = () => {}) {
  const id = parseYouTubeId(url)
  if (!id) throw new Error('That does not look like a YouTube link.')
  onStep('Reading the link')
  const title = (await fetchTitle(url)) || `YouTube song ${id}`
  for (const s of ['Fetching the audio', 'Tracking the melody', 'Mapping notes to the piano', 'Syncing lyrics']) {
    onStep(s)
    await wait(650)
  }
  const { bpm, notes } = mockMelody(id)
  return { id: `yt-${id}`, title, bpm, notes, source: url, mock: true }
}

export function useCustomSongs() {
  const [songs, setSongs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
  })
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(songs)) } catch { /* storage unavailable */ }
  }, [songs])
  const add = useCallback((song) => setSongs((p) => [song, ...p.filter((s) => s.id !== song.id)]), [])
  const remove = useCallback((id) => setSongs((p) => p.filter((s) => s.id !== id)), [])
  return { songs, add, remove }
}
