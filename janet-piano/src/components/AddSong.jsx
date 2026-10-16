import { useState } from 'react'
import { analyzeYouTube } from '../lib/customSongs'

// "Add a song" from a YouTube link. PREVIEW: generates a placeholder melody (real analysis needs a server).
export default function AddSong({ onAdded, onClose }) {
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [step, setStep] = useState('')
  const [error, setError] = useState('')

  const run = async (e) => {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      const song = await analyzeYouTube(url, setStep)
      onAdded(song)
    } catch (err) {
      setError(err.message || 'Could not analyze that link.')
    } finally { setBusy(false); setStep('') }
  }

  return (
    <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label="Add a song">
      <div className="scrim" onClick={onClose} />
      <form className="sheet" onSubmit={run}>
        <header><h3>Add a song</h3><button type="button" className="link" onClick={onClose} aria-label="Close">✕</button></header>
        <label className="field">
          <span>YouTube link</span>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=…" inputMode="url" autoFocus />
        </label>
        <button className="btn primary block" disabled={busy || !url.trim()}>{busy ? `${step}…` : 'Analyze song'}</button>
        {error && <p className="notice err">{error}</p>}
        <p className="fine">Preview: this demo maps a placeholder melody to the piano keys. The real version analyzes the audio on a server and syncs the lyrics. Only add songs you have the right to use.</p>
      </form>
    </div>
  )
}
