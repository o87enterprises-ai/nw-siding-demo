import { useState } from 'react'
import Piano3D from './Piano3D'
import Paywall from './Paywall'
import RoomBar from './RoomBar'
import { SONGS, noteToKeyboard, pretty } from '../lib/notes'
import { usePractice } from '../lib/practice'
import { usePlan } from '../lib/plan'

// Full-screen piano with light-up lessons. Subscribers only (mock gate).
function Room() {
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
          {SONGS.map((s) => (
            <button key={s.id} className={`pill ${s.id === songId ? 'sel' : ''}`} onClick={() => setSongId(s.id)} aria-pressed={s.id === songId}>{s.title}</button>
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

export default function LessonsPage() {
  const { hasLessons } = usePlan()
  return hasLessons ? <Room /> : <Paywall />
}
