import { centsFromNearest, centsFromTarget, hzToMidi, midiToName } from '../lib/pitch'

// Red (off) -> yellow (close) -> green (in tune).
const hueFor = (cents) => 120 * (1 - Math.min(1, Math.max(0, (Math.abs(cents) - 10) / 40)))

export default function TunerMeter({ freq, target, listening, level, error, onEnable }) {
  if (!listening) {
    return (
      <div className="tuner idle">
        <button className="btn primary" onClick={onEnable}>Turn on microphone</button>
        <p className="tuner-note">{error || 'Sing into your mic and see your pitch live. Audio stays on your device.'}</p>
      </div>
    )
  }
  const has = !!freq
  const cents = has ? (target ? centsFromTarget(freq, target) : centsFromNearest(freq)) : 0
  const name = has ? midiToName(hzToMidi(freq)) : '–'
  const hue = has ? hueFor(cents) : 0
  const color = has ? `hsl(${hue} 72% 42%)` : 'var(--muted)'
  const pos = 50 + Math.max(-50, Math.min(50, cents))
  const verdict = !has ? 'Sing…' : Math.abs(cents) <= 15 ? 'In tune' : cents > 0 ? 'Sharp' : 'Flat'

  return (
    <div className="tuner" role="group" aria-label="Pitch tuner">
      <div className="tuner-top">
        <span className="tuner-name" style={{ color }}>{name.replace(/\d/, '')}<small>{name.replace(/\D/g, '')}</small></span>
        <div className="tuner-meta">
          <span className="tuner-verdict" style={{ color }} aria-live="polite">{verdict}</span>
          {has && <span className="tuner-cents">{cents > 0 ? '+' : ''}{Math.round(cents)}¢</span>}
          {target && <span className="tuner-target">aim for {target.replace(/\d/, '')}</span>}
        </div>
        <span className="tuner-level" aria-hidden="true"><i style={{ height: `${Math.round(level * 100)}%` }} /></span>
      </div>
      <div className="tuner-bar" aria-hidden="true">
        <div className="tuner-track" />
        <div className="tuner-needle" style={{ left: `${pos}%`, background: color, opacity: has ? 1 : 0.2 }} />
      </div>
      <div className="tuner-scale" aria-hidden="true"><span>Flat</span><span>In tune</span><span>Sharp</span></div>
    </div>
  )
}
