import { motion } from 'framer-motion'
import Piano3D from './Piano3D'
import Logo from './Logo'
import { SONGS, noteToKeyboard, pretty } from '../lib/notes'
import { usePractice } from '../lib/practice'
import { Link } from '../lib/router'

const song = SONGS[0]

export default function Hero() {
  const { mode, hint, target, practice, startLearn, startJanet, stop } = usePractice(song)

  return (
    <section className="hero" id="top">
      <div className="piano-layer">
        <Piano3D practice={practice} />
      </div>

      <div className="hero-content">
        <div className="tools">
          <div className="controls">
            <button className={mode === 'learn' ? 'on' : ''} onClick={mode === 'learn' ? stop : startLearn}>
              {mode === 'learn' ? 'Stop' : 'Learn'}
            </button>
            <button className={mode === 'janet' ? 'on' : ''} onClick={mode === 'janet' ? stop : startJanet}>
              {mode === 'janet' ? 'Stop' : 'Play along'}
            </button>
          </div>
          <p className="piano-status" aria-live="polite">
            {target && <span className="chip">{pretty(target)} <kbd>{noteToKeyboard[target]}</kbd></span>}
            {hint}
          </p>
        </div>

        <div className="hero-center">
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="hero-seal-wrap">
            <Logo size="100%" className="hero-seal" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <h1>Learn piano with Janet</h1>
            <p className="lede">No piano needed.</p>
            <div className="cta-row">
              <Link className="btn primary" to="/plans">See plans</Link>
              <Link className="btn" to="/book">Book a session</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
