import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Piano3D from './Piano3D'
import TunerMeter from './TunerMeter'
import Lyrics from './Lyrics'
import AddSong from './AddSong'
import Dropdown from './Dropdown'
import RotateHint from './RotateHint'
import NavMenu from './NavMenu'
import Logo from './Logo'
import { SONGS } from '../lib/notes'
import { usePractice } from '../lib/practice'
import { useSing } from '../lib/sing'
import { useMic } from '../lib/mic'
import { useCustomSongs } from '../lib/customSongs'
import { usePlan } from '../lib/plan'
import { Link } from '../lib/router'

// Height of the dropped-down piano area; shorter on landscape phones so the lyrics and tuner stay in reach.
const holoHeight = () => (window.innerHeight < 520 ? Math.round(window.innerWidth * 0.215 + 26) : Math.round(Math.min(520, Math.max(300, window.innerHeight * 0.54))))

const MODES = [
  { value: 'sing', label: 'Sing along' },
  { value: 'solo', label: 'Sing solo' },
  { value: 'hear', label: 'Hear it' },
  { value: 'play', label: 'Play piano' },
  { value: 'tune', label: 'Tuner' },
]
const ACTION = { sing: 'Sing', solo: 'Sing', hear: 'Hear', play: 'Play', tune: 'Tune' }
const verdict = (a) => (a >= 0.8 ? 'Great pitch!' : a >= 0.55 ? 'Getting there' : 'Keep going')

// The whole singing flow in one holographic console: [piano + upcoming notes] / lyrics + tuner / three dropdowns and one button.
//  - collapsible: the piano drops down from a tab (landing page). Otherwise it is always shown (practice and live rooms).
//  - demo: everything is open to everyone and "add a song" is hidden (landing page).
//  - live: boolean from the live-session page; the action button stays disabled until the session starts.
export default function Studio({ mode0 = 'sing', collapsible = false, open = true, onOpenChange, demo = false, live, onCaption, room = false }) {
  const { hasLessons } = usePlan()
  const custom = useCustomSongs()
  const songs = [...SONGS, ...custom.songs]
  const [songId, setSongId] = useState(SONGS[0].id)
  const song = songs.find((s) => s.id === songId) || SONGS[0]
  const [mode, setMode] = useState(mode0)
  const [adding, setAdding] = useState(false)

  const mic = useMic()
  const piano = usePractice(song)
  const sing = useSing(song, mic, { guide: mode !== 'solo' })
  const gated = typeof live === 'boolean'
  const disabled = gated && !live
  const shown = !collapsible || open
  const [holoH, setHoloH] = useState(() => holoHeight())
  useEffect(() => {
    const on = () => setHoloH(holoHeight())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])

  // The 3D lane reads whichever session is running.
  const active = useRef(piano.practice.current)
  active.current = sing.running ? sing.practice.current : piano.practice.current

  const stopAll = () => { piano.stop(); sing.stop() }
  const changeMode = (m) => { stopAll(); if (m !== 'tune') mic.stop(); setMode(m) }
  const changeSong = (v) => {
    if (v === '__add__') { hasLessons ? setAdding(true) : window.history.pushState({}, '', '/plans') || window.dispatchEvent(new PopStateEvent('popstate')); return }
    stopAll(); setSongId(v)
  }

  // Live sessions: Janet starts by playing the song and the keys light up (key match).
  useEffect(() => {
    if (live === true) {
      const id = setTimeout(() => piano.startJanet(), 600)
      return () => clearTimeout(id)
    }
    if (live === false) stopAll()
  }, [live]) // eslint-disable-line react-hooks/exhaustive-deps

  const hint = sing.running ? sing.hint : piano.mode !== 'free' ? piano.hint : ''
  useEffect(() => { onCaption?.(sing.running ? sing.hint : piano.hint) }, [sing.hint, sing.running, piano.hint]) // eslint-disable-line react-hooks/exhaustive-deps

  const running = mode === 'hear' ? piano.mode === 'janet' : mode === 'play' ? piano.mode === 'learn' : mode === 'tune' ? mic.listening : sing.running
  const act = () => {
    if (running) { stopAll(); if (mode === 'tune') mic.stop(); return }
    stopAll()
    if (mode === 'hear') piano.startJanet()
    else if (mode === 'play') piano.startLearn()
    else if (mode === 'tune') mic.start()
    else sing.start()
  }

  const lyricIndex = sing.running ? sing.index : piano.mode === 'janet' ? piano.step : -1
  const tunerTarget = sing.running && sing.index >= 0 ? song.notes[sing.index][0] : null

  const songOptions = [
    ...songs.map((s) => ({ value: s.id, label: s.title })),
    ...(!demo ? [{ value: '__add__', label: hasLessons ? '+ Add a song' : '+ Add a song (members)' }] : []),
  ]

  return (
    <div className={`holo ${room ? 'holo-room' : ''} ${shown ? 'is-open' : ''}`}>
      {collapsible && (
        <button className="holo-tab" aria-expanded={open} onClick={() => onOpenChange?.(!open)}>
          Piano
          <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true" className={open ? 'flip' : ''}><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      )}

      <motion.div
        className="holo-piano"
        initial={false}
        animate={collapsible ? { height: open ? holoH : 0, opacity: open ? 1 : 0 } : { opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={collapsible ? { overflow: 'hidden' } : undefined}
        aria-hidden={!shown}
      >
        {shown && <Piano3D practice={active} />}
        <span className="holo-corner tl" /><span className="holo-corner tr" /><span className="holo-corner bl" /><span className="holo-corner br" />
      </motion.div>

      <div className="holo-info">
        {sing.state === 'done' && sing.result ? (
          <div className="result"><b>{Math.round(sing.result.accuracy * 100)}%</b><span>{verdict(sing.result.accuracy)}</span></div>
        ) : (
          <Lyrics notes={song.notes} index={lyricIndex} />
        )}
        <TunerMeter freq={mic.freq} target={tunerTarget} listening={mic.listening} level={mic.level} error={mic.error} onEnable={mic.start} />
        <p className="holo-hint" aria-live="polite">{hint}</p>
      </div>

      <div className="holo-controls">
        {room && <Link to="/" className="holo-logo" aria-label="Home"><Logo size={38} /></Link>}
        <Dropdown label="Song" value={song.id} onChange={changeSong} options={songOptions} className="dd-song" />
        <Dropdown label="Mode" value={mode} onChange={changeMode} options={MODES} />
        <button className={`go ${running ? 'on' : ''}`} disabled={disabled} onClick={act}>{running ? 'Stop' : ACTION[mode]}</button>
        {room && <NavMenu className="inline" />}
      </div>
      {shown && <RotateHint />}

      {adding && <AddSong onClose={() => setAdding(false)} onAdded={(s) => { custom.add(s); stopAll(); setSongId(s.id); setAdding(false) }} />}
    </div>
  )
}
