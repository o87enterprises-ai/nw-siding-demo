import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionBackground from './SectionBackground'

const STATS_IMAGES = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80',
]

const MARQUEE_ITEMS = [
  'James Hardie® Exclusive Preferred Remodeler',
  'GuildQuality Master Award Winner',
  'Licensed · Bonded · Insured',
  'CCB #136733',
  'Certified Lead-Safe Renovators',
  'Serving Eugene · Springfield · Albany · Roseburg · Creswell',
  '3-Year Workmanship Warranty',
]

function StatCard({ number, label, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        textAlign: 'center',
        padding: '2.5rem 2rem',
        borderRight: '1px solid var(--border)',
        flex: '1 1 160px',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(2.4rem, 4vw, 3.5rem)',
        fontWeight: 700,
        color: 'var(--gold)',
        lineHeight: 1,
        marginBottom: '0.6rem',
      }}>{number}</div>
      <div style={{
        fontSize: '0.68rem',
        fontWeight: 500,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
      }}>{label}</div>
    </motion.div>
  )
}

export default function Stats() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

  return (
    <>
      {/* Stats row */}
      <section id="about" style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <SectionBackground images={STATS_IMAGES} overlay={0.88} />
        <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          maxWidth: '1100px',
          margin: '0 auto',
        }}>
          <StatCard number="25+" label="Years of Excellence" delay={0} />
          <StatCard number="2,000+" label="Homes Completed" delay={0.1} />
          <StatCard number="Master" label="GuildQuality Award" delay={0.2} />
          <StatCard number="Licensed" label="Oregon CCB #136733" delay={0.3} />
          <StatCard
            number="Exclusive"
            label="James Hardie® Preferred Remodeler, Eugene-Springfield"
            delay={0.4}
          />
        </div>
        </div>
      </section>

      {/* Marquee trust strip */}
      <div className="marquee-outer">
        <div className="marquee-track">
          {doubled.map((item, i) => (
            <span key={i} className="marquee-item">
              {item}
              <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
