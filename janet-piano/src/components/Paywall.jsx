import Logo from './Logo'
import { Link } from '../lib/router'

export default function Paywall({ premium = false }) {
  return (
    <div className="paywall">
      <Logo size={150} />
      <h2>{premium ? 'Premium members only.' : 'Members only.'}</h2>
      <p className="muted">{premium ? 'Live lessons come with Premium.' : 'Unlock every lesson.'}</p>
      <Link className="btn primary" to="/plans">See plans</Link>
      <Link className="link" to="/">Home</Link>
    </div>
  )
}
