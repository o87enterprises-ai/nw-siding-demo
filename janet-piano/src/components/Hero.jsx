import { useState } from 'react'
import { motion } from 'framer-motion'
import Studio from './Studio'
import Logo from './Logo'
import NavMenu from './NavMenu'
import { Link } from '../lib/router'

// The singing demo is the first thing on the page. The piano drops down from its tab; while it is open
// everything else steps aside so only the piano, the upcoming notes, the lyrics and the tuner remain.
export default function Hero() {
  const [open, setOpen] = useState(false)
  return (
    <section className="hero" id="top">
      <NavMenu className="fixed" />
      <Studio collapsible open={open} onOpenChange={setOpen} demo />
      <motion.div
        className="hero-center"
        initial={false}
        animate={{ opacity: open ? 0 : 1, height: open ? 0 : 'auto', paddingTop: open ? 0 : 32, paddingBottom: open ? 0 : 64 }}
        transition={{ duration: 0.45 }}
        style={{ overflow: 'hidden' }}
        aria-hidden={open}
      >
        <div className="hero-seal-wrap"><Logo size="100%" className="hero-seal" /></div>
        <h1>Vocal and piano lessons with Janet</h1>
        <Link className="btn primary" to="/plans" tabIndex={open ? -1 : 0}>See plans</Link>
      </motion.div>
    </section>
  )
}
