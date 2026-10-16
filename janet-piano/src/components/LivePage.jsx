import { useEffect, useState } from 'react'
import Piano3D from './Piano3D'
import Paywall from './Paywall'
import RoomBar from './RoomBar'
import VideoPanel from './VideoPanel'
import { SONGS } from '../lib/notes'
import { usePractice } from '../lib/practice'
import { usePlan } from '../lib/plan'

const song = SONGS[0]

// Premium: video of Janet directly above the piano. Keys Janet plays light up on the student's keys (key match).
function Room() {
  const { mode, hint, practice, startLearn, startJanet, stop } = usePractice(song)
  const [live, setLive] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!live) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [live])

  const start = () => { setSeconds(0); setLive(true); setTimeout(startJanet, 600) }
  const end = () => { setLive(false); stop() }

  return (
    <div className="room live-room">
      <VideoPanel live={live} seconds={seconds} caption={hint} onStart={start} onEnd={end} />
      <div className="room-canvas"><Piano3D practice={practice} /></div>
      <RoomBar status={live ? 'Key match on' : ''}>
        <div className="controls">
          <button disabled={!live} className={mode === 'janet' ? 'on' : ''} onClick={mode === 'janet' ? stop : startJanet}>{mode === 'janet' ? 'Stop' : 'Janet plays'}</button>
          <button disabled={!live} className={mode === 'learn' ? 'on' : ''} onClick={mode === 'learn' ? stop : startLearn}>{mode === 'learn' ? 'Stop' : 'Your turn'}</button>
        </div>
      </RoomBar>
    </div>
  )
}

export default function LivePage() {
  const { isPremium } = usePlan()
  return isPremium ? <Room /> : <Paywall premium />
}
