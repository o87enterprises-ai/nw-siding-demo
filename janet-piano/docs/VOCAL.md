# Vocal tuner and singalongs

## What is real in the preview
- **Pitch tuner** (`src/lib/pitch.js`, `src/lib/mic.js`): the browser microphone is analysed locally with the YIN algorithm.
  Audio never leaves the device. Detected note and cents drive the red (off) to yellow to green (in tune) meter.
  Octave-folded, so any voice range can match a target note.
- **Singalong** (`src/lib/sing.js`): the piano plays and lights each note (the guide), lyrics follow along, and each
  sung frame is scored against the current note (within 35 cents, any octave). Final score shown as a percentage.
- **Live sessions** use the same room with Janet's video tile directly above the piano.

## What is mock
- **Add a song from a YouTube link** (`src/lib/customSongs.js`): only the link parsing and the video title lookup are real.
  The melody is a deterministic placeholder (16 notes, "la" lyrics) so the whole flow can be tried.
  Custom songs are stored in this browser only.

## Making the YouTube analysis real (needs a server)
A browser cannot read YouTube audio (CORS), so this runs server-side, e.g. a Cloudflare Worker queue plus a small container:
1. **Rights first.** Only analyze songs Janet or the student has the right to use. Downloading or republishing
   copyrighted audio and lyrics may breach YouTube's terms and copyright law; get legal advice before launch.
2. **Audio:** fetch audio for the link (e.g. `yt-dlp`), keep it private and delete it after analysis.
3. **Melody:** separate vocals if needed, then track pitch (pYIN / CREPE / basic-pitch) and quantize to notes with durations and tempo.
4. **Lyrics:** use licensed lyric data or captions, and align syllables to notes (forced alignment, e.g. Whisper plus an aligner).
5. **Output:** the same song shape the app already uses: `{ id, title, bpm, notes: [[note, beats, syllable], ...] }`.
   Store in Supabase (`songs` table) per student; replace `analyzeYouTube()` with a `POST /api/songs` call plus polling.
6. Let Janet review and edit the mapped notes and lyrics before a student sees them.

## Tips
- Headphones keep the piano guide out of the microphone.
- Scoring ignores the first 250 ms of each note so singers can find the pitch.
