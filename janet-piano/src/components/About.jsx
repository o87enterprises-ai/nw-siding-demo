import { motion } from 'framer-motion'

const CREDENTIALS = ['Beginner Lessons', 'Intermediate Lessons', 'Adult Learners', 'Recital Preparation', 'Music Theory']
const PILLARS = [
  ['Technique', 'Relaxed hands, good posture and habits that last.'],
  ['Theory', 'Understand what you play, not just where your fingers go.'],
  ['Ear training', 'Hear intervals and chords, and play what you hear.'],
  ['Performance', 'Build confidence with recitals and real audiences.'],
]

export default function About() {
  return (
    <section className="section" id="about">
      <motion.div className="about-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8 }}>
        <div className="portrait" role="img" aria-label="Portrait placeholder for Janet Holmes">
          {/* Replace with Janet's photo: <img src="/janet.jpg" alt="Janet Holmes at the piano" /> */}
          <svg viewBox="0 0 300 380" aria-hidden="true">
            <defs>
              <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#7d1019" /><stop offset="1" stopColor="#2a0a0e" />
              </linearGradient>
            </defs>
            <rect width="300" height="380" fill="url(#pg)" />
            <circle cx="150" cy="140" r="58" fill="#f8f2ec" opacity="0.14" />
            <path d="M40 380c0-82 48-128 110-128s110 46 110 128z" fill="#f8f2ec" opacity="0.14" />
            <text x="150" y="215" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="92" fill="#caa76a" fontWeight="700">JH</text>
          </svg>
          <span className="photo-note">Photo coming soon</span>
        </div>
        <div className="about-copy">
          <p className="eyebrow">About Janet</p>
          <h2>Strong foundations, lifelong enjoyment</h2>
          <p>
            Janet Holmes is a dedicated piano instructor focused on building strong musical foundations through engaging, personalized lessons.
            Students progress through technique, theory, ear training, performance skills, and repertoire while learning to enjoy music for life.
          </p>
          <h3>Teaching philosophy</h3>
          <ul className="pillars">
            {PILLARS.map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}
          </ul>
          <h3>Lessons offered</h3>
          <ul className="creds">
            {CREDENTIALS.map((c) => <li key={c}>🎹 {c}</li>)}
          </ul>
        </div>
      </motion.div>
    </section>
  )
}
