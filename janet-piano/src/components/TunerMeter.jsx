import { centsFromNearest, centsFromTarget, hzToMidi, midiToName } from '../lib/pitch'

// Red (off) -> yellow (close) -> green (in tune). Green appears only here, as the "in tune" signal.
const hueFor = (cents) => 120 * (1 - Math.min(1, Math.max(0, (Math.abs(cents) - 10) / 40)))

export default function TunerMeter({ freq, target, listening, level, error, onEnable }) {
  const has = listening && !!freq
  const cents = has ? (target ? centsFromTarget(freq, target) : centsFromNearest(freq)) : 0
  const name = has ? midiToName(hzToMidi(freq)) : '–'
  const hue = has ? hueFor(cents) : 0
  const color = has ? `hsl(${hue} 72% 42%)` : 'var(--muted)'
  const pos = 50 + Math.max(-50, Math.min(50, cents))
  const verdict = !has ? '' : Math.abs(cents) <= 15 ? 'In tune' : cents > 0 ? 'Sharp' : 'Flat'

  const body = (
    <>
      <div className="tuner-top">
        <span className="tuner-name" style={{ color }}>{name.replace(/\d/, '')}<small>{has ? name.replace(/\D/g, '') : ''}</small></span>
        <div className="tuner-meta">
          <span className="tuner-verdict" style={{ color }} aria-live="polite">{verdict}</span>
          {has && <span className="tuner-cents">{cents > 0 ? '+' : ''}{Math.round(cents)}¢</span>}
        </div>
        <span className="tuner-level" aria-hidden="true"><i style={{ height: `${Math.round((listening ? level : 0) * 100)}%` }} /></span>
      </div>
      <div className="tuner-bar" aria-hidden="true">
        <div className="tuner-track" />
        <div className="tuner-needle" style={{ left: `${pos}%`, background: color, opacity: has ? 1 : 0.25 }} />
      </div>
    </>
  )

  if (!listening) {
    return (
      <button className="tuner idle" onClick={onEnable} aria-label="Turn on microphone">
        {body}
        <span className="tuner-tap">{error || 'Tap to tune'}</span>
      </button>
    )
  }
  return <div className="tuner" role="group" aria-label="Pitch tuner">{body}</div>
}
