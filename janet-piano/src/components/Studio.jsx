import { useEffect, useRef, useState } from 'react'
import Piano3D from './Piano3D'
import RoomBar from './RoomBar'
import TunerMeter from './TunerMeter'
import Lyrics from './Lyrics'
import AddSong from './AddSong'
import { SONGS, noteToKeyboard, pretty } from '../lib/notes'
import { usePractice } from '../lib/practice'
import { useSing } from '../lib/sing'
import { useMic } from '../lib/mic'
import { useCustomSongs } from '../lib/customSongs'
import { usePlan } from '../lib/plan'
import { Link } from '../lib/router'

const Lock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
)

const verdict = (a) => (a >= 0.8 ? 'Great pitch!' : a >= 0.55 ? 'Getting there.' : 'Keep practicing.')

// The shared lesson room: full-screen piano on top, then (vocal mode) lyrics + pitch tuner, then the control bar.
// `live` (boolean) is passed by the live-session page: controls stay disabled until the session starts.
export default function Studio({ mode0 = 'piano', live, onCaption }) {
  const { hasLessons } = usePlan()
  const custom = useCustomSongs()
  const songs = [...SONGS, ...custom.songs]
  const [songId, setSongId] = useState(SONGS[0].id)
  const song = songs.find((s) => s.id === songId) || SONGS[0]
  const [mode, setMode] = useState(mode0)
  const [guide, setGuide] = useState(true)
  const [adding, setAdding] = useState(false)

  const mic = useMic()
  const piano = usePractice(song)
  const sing = useSing(song, mic, { guide })
  const gated = typeof live === 'boolean'
  const disabled = gated && !live

  // The 3D lane reads whichever session is running.
  const active = useRef(piano.practice.current)
  active.current = sing.running ? sing.practice.current : piano.practice.current

  const stopAll = () => { piano.stop(); sing.stop() }
  const choose = (id) => { stopAll(); setSongId(id) }
  const changeMode = (m) => { stopAll(); setMode(m) }

  // Live sessions: Janet starts by playing the song, keys light up (key match).
  useEffect(() => {
    if (live === true) {
      const id = setTimeout(() => piano.startJanet(), 600)
      return () => clearTimeout(id)
    }
    if (live === false) stopAll()
  }, [live]) // eslint-disable-line react-hooks/exhaustive-deps

  const hint = sing.running ? sing.hint : piano.mode !== 'free' || sing.state !== 'done' ? piano.hint : ''
  useEffect(() => { onCaption?.(sing.running ? sing.hint : piano.hint) }, [sing.hint, sing.running, piano.hint]) // eslint-disable-line react-hooks/exhaustive-deps

  const lyricIndex = sing.running ? sing.index : piano.mode === 'janet' ? piano.step : -1
  const tunerTarget = sing.running && sing.index >= 0 ? song.notes[sing.index][0] : null
  const showTarget = piano.target

  const startSing = () => { piano.stop(); sing.start() }
  const startJanet = () => { sing.stop(); piano.startJanet() }
  const startLearn = () => { sing.stop(); piano.startLearn() }

  return (
    <>
      <div className="room-canvas"><Piano3D practice={active} /></div>

      {mode === 'vocal' && (
        <section className="sing-panel" aria-label="Vocal practice">
          {sing.state === 'done' && sing.result ? (
            <div className="result">
              <b>{Math.round(sing.result.accuracy * 100)}%</b>
              <span>{verdict(sing.result.accuracy)}</span>
            </div>
          ) : (
            <Lyrics notes={song.notes} index={lyricIndex} />
          )}
          <TunerMeter freq={mic.freq} target={tunerTarget} listening={mic.listening} level={mic.level} error={mic.error} onEnable={mic.start} />
          <p className="fine panel-tip">Headphones keep the piano out of the mic.</p>
        </section>
      )}

      <RoomBar status={mode === 'piano'
        ? <>{showTarget && <span className="chip">{pretty(showTarget)} <kbd>{noteToKeyboard[showTarget]}</kbd></span>}{piano.hint}{piano.mode !== 'free' && <span className="progress"> {Math.min(piano.step, song.notes.length)}/{song.notes.length}</span>}</>
        : hint}>
        <div className="seg" role="group" aria-label="Mode">
          <button className={mode === 'piano' ? 'on' : ''} aria-pressed={mode === 'piano'} onClick={() => changeMode('piano')}>Piano</button>
          <button className={mode === 'vocal' ? 'on' : ''} aria-pressed={mode === 'vocal'} onClick={() => changeMode('vocal')}>Vocal</button>
        </div>
        <div className="songs" role="group" aria-label="Song">
          {songs.map((s, i) => (
            hasLessons || i === 0 ? (
              <button key={s.id} className={`pill ${s.id === song.id ? 'sel' : ''}`} onClick={() => choose(s.id)} aria-pressed={s.id === song.id}>{s.title}</button>
            ) : (
              <Link key={s.id} to="/plans" className="pill locked" aria-label={`${s.title}, members only`}><Lock />{s.title}</Link>
            )
          ))}
          {hasLessons
            ? <button className="pill add" onClick={() => setAdding(true)}>+ Song</button>
            : <Link to="/plans" className="pill locked" aria-label="Add a song, members only"><Lock />+ Song</Link>}
        </div>
        <div className="controls">
          {mode === 'piano' ? (
            <>
              <button disabled={disabled} className={piano.mode === 'learn' ? 'on' : ''} onClick={piano.mode === 'learn' ? piano.stop : startLearn}>{piano.mode === 'learn' ? 'Stop' : 'Learn'}</button>
              <button disabled={disabled} className={piano.mode === 'janet' ? 'on' : ''} onClick={piano.mode === 'janet' ? piano.stop : startJanet}>{piano.mode === 'janet' ? 'Stop' : 'Janet plays'}</button>
            </>
          ) : (
            <>
              <button disabled={disabled} className={piano.mode === 'janet' ? 'on' : ''} onClick={piano.mode === 'janet' ? piano.stop : startJanet}>{piano.mode === 'janet' ? 'Stop' : gated ? 'Janet plays' : 'Hear it'}</button>
              <button disabled={disabled} className={sing.running ? 'on' : ''} onClick={sing.running ? sing.stop : startSing}>{sing.running ? 'Stop' : gated ? 'Your turn' : 'Sing'}</button>
              <button className={guide ? '' : 'off'} aria-pressed={guide} onClick={() => setGuide((g) => !g)}>Guide {guide ? 'on' : 'off'}</button>
            </>
          )}
        </div>
      </RoomBar>

      {adding && <AddSong onClose={() => setAdding(false)} onAdded={(s) => { custom.add(s); choose(s.id); setMode('vocal'); setAdding(false) }} />}
    </>
  )
}
