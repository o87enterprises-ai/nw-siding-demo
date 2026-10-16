import { useRef } from 'react'
import Piano3D from './Piano3D'
import Logo from './Logo'
import RotateHint from './RotateHint'
import { Link } from '../lib/router'

// Locked pages still show the playable piano (the main attraction); only the lessons are gated.
export default function Paywall({ premium = false }) {
  const practice = useRef({ active: false, step: 0, notes: [] })
  return (
    <div className="room">
      <div className="room-canvas"><Piano3D practice={practice} /></div>
      <div className="paywall-bar">
        <RotateHint />
        <Link to="/" aria-label="Home"><Logo size={72} /></Link>
        <h2>{premium ? 'Live lessons are for Premium members.' : 'Lessons are for members.'}</h2>
        <div className="cta-row">
          <Link className="btn primary" to="/plans">See plans</Link>
          <Link className="btn" to="/">Home</Link>
        </div>
      </div>
    </div>
  )
}
