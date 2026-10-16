// Karaoke-style lyric strip: sung syllables fade, the current one is large and red.
export default function Lyrics({ notes, index }) {
  const i = Math.max(0, index)
  const from = Math.max(0, i - 3)
  const to = Math.min(notes.length, i + 9)
  return (
    <p className="lyrics" aria-live="off">
      {notes.slice(from, to).map((n, k) => {
        const idx = from + k
        const cls = index < 0 ? (idx < 6 ? 'next' : 'later') : idx < index ? 'done' : idx === index ? 'now' : 'next'
        return <span key={idx} className={cls}>{n[2] || '♪'} </span>
      })}
    </p>
  )
}
