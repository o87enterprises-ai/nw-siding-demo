import Logo from './Logo'

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

// Mock FaceTime-style call tile. No camera, microphone or network is used.
export default function VideoPanel({ live, seconds, caption, onStart, onEnd }) {
  return (
    <div className="video">
      <div className="video-main">
        <div className={`avatar ${live ? 'live' : ''}`}><Logo size={120} /></div>
        <p className="video-name">Janet Holmes</p>
        {live ? <span className="live-badge"><i />Live {fmt(seconds)}</span> : <span className="video-idle">Ready</span>}
        {live && <p className="caption">{caption}</p>}
      </div>
      {live && <div className="video-self" aria-label="Your video">You</div>}
      <div className="video-controls">
        {live ? (
          <button className="end" onClick={onEnd}>End</button>
        ) : (
          <button className="start" onClick={onStart}>Start session</button>
        )}
      </div>
      <span className="mock-tag">Preview</span>
    </div>
  )
}
