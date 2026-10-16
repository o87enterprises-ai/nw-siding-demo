import { useState } from 'react'
import Piano3D from './Piano3D'
import RoomBar from './RoomBar'
import { SONGS, noteToKeyboard, pretty } from '../lib/notes'
import { usePractice } from '../lib/practice'
import { usePlan } from '../lib/plan'
import { Link } from '../lib/router'

// Full-screen piano with light-up lessons. Free plan: first song only; members: every song (mock gate).
export default function LessonsPage() {
  const { hasLessons } = usePlan()
  const [songId, setSongId] = useState(SONGS[0].id)
  const song = SONGS.find((s) => s.id === songId)
  const { mode, step, hint, target, practice, startLearn, startJanet, stop } = usePractice(song)

  return (
    <div className="room">
      <div className="room-canvas"><Piano3D practice={practice} /></div>
      <RoomBar status={<>
        {target && <span className="chip">{pretty(target)} <kbd>{noteToKeyboard[target]}</kbd></span>}
        {hint}{mode !== 'free' && <span className="progress"> {Math.min(step, song.notes.length)}/{song.notes.length}</span>}
      </>}>
        <div className="songs" role="group" aria-label="Song">
          {SONGS.map((s, i) => (
            hasLessons || i === 0 ? (
              <button key={s.id} className={`pill ${s.id === songId ? 'sel' : ''}`} onClick={() => setSongId(s.id)} aria-pressed={s.id === songId}>{s.title}</button>
            ) : (
              <Link key={s.id} to="/plans" className="pill locked" aria-label={`${s.title}, members only`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                {s.title}
              </Link>
            )
          ))}
        </div>
        <div className="controls">
          <button className={mode === 'learn' ? 'on' : ''} onClick={mode === 'learn' ? stop : startLearn}>{mode === 'learn' ? 'Stop' : 'Learn'}</button>
          <button className={mode === 'janet' ? 'on' : ''} onClick={mode === 'janet' ? stop : startJanet}>{mode === 'janet' ? 'Stop' : 'Janet plays'}</button>
        </div>
      </RoomBar>
    </div>
  )
}
