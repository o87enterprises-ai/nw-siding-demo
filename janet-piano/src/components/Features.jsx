import { motion } from 'framer-motion'
import { Link } from '../lib/router'

const ITEMS = [
  ['/sing', 'Vocal tuner', 'Sing into your mic and watch your pitch go from red to green.'],
  ['/lessons', 'Light-up lessons', 'Follow the glowing keys on a full-screen piano.'],
  ['/live', 'Live 1:1', 'Video with Janet, right above the keys.'],
  ['/live', 'Key match', 'Every key Janet plays lights up on yours.'],
]

export default function Features() {
  return (
    <section className="section" id="features">
      <div className="features">
        {ITEMS.map(([to, title, text], i) => (
          <motion.div key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay: i * 0.1 }}>
            <Link to={to} className="feature">
              <h3>{title}</h3>
              <p>{text}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
