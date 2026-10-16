import { useEffect, useState } from 'react'
import Paywall from './Paywall'
import Studio from './Studio'
import VideoPanel from './VideoPanel'
import { usePlan } from '../lib/plan'

// Premium: the same lesson flow as the other rooms (piano and vocal), with Janet's video directly above the piano.
// Keys Janet plays light up on the student's keys (key match).
function Room() {
  const [live, setLive] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [caption, setCaption] = useState('')

  useEffect(() => {
    if (!live) return
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [live])

  return (
    <div className="room live-room">
      <VideoPanel live={live} seconds={seconds} caption={caption} onStart={() => { setSeconds(0); setLive(true) }} onEnd={() => setLive(false)} />
      <Studio mode0="sing" room live={live} onCaption={setCaption} />
    </div>
  )
}

export default function LivePage() {
  const { isPremium } = usePlan()
  return isPremium ? <Room /> : <Paywall premium />
}
