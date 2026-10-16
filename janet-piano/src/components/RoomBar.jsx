import Logo from './Logo'
import RotateHint from './RotateHint'
import { Link } from '../lib/router'

// Bottom control bar shared by the full-screen rooms. Keeps the piano at the top edge unobstructed.
export default function RoomBar({ children, status }) {
  return (
    <div className="room-bar">
      <RotateHint />
      <Link to="/" aria-label="Home"><Logo size={44} /></Link>
      <div className="room-controls">{children}</div>
      <p className="room-status" aria-live="polite">{status}</p>
    </div>
  )
}
