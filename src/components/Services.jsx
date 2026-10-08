import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionBackground from './SectionBackground'

const SERVICES_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1534398079543-7ae6d016b86a?auto=format&fit=crop&w=1920&q=80',
]

const SERVICES = [
  {
    num: '01',
    title: 'Fiber Cement Siding',
    sub: 'James Hardie® Exclusive',
    desc: "As James Hardie®'s Exclusive Preferred Remodeler for Eugene-Springfield, we install James Hardie® fiber cement siding to factory specification — with the manufacturer warranty to match.",
    tags: ['HardiePlank®', 'HardieShingle®', 'HardiePanel®'],
  },
  {
    num: '02',
    title: 'Cedar & Wood Siding',
    sub: 'Natural Materials',
    desc: 'Tight Knot, Clear Beveled Lap Cedar, Cedar Shingles, and Breckenridge Douglas Fir Panel. Natural beauty, installed with precision.',
    tags: ['Tight Knot Cedar', 'Clear Beveled Lap', 'Shingle & Panel'],
  },
  {
    num: '03',
    title: 'Replacement Windows',
    sub: 'Milgard® Certified',
    desc: 'Milgard Tuscany®, Montecito®, and Style Line Series® windows installed by certified technicians. Energy efficiency meets lasting curb appeal.',
    tags: ['Tuscany®', 'Montecito®', 'Style Line®'],
  },
  {
    num: '04',
    title: 'Seamless Gutters',
    sub: 'Steel & Aluminum',
    desc: 'On-site custom fabrication of 5" K-Style and 6" fascia-style seamless steel gutters. Measured, cut, and installed in a single visit.',
    tags: ['5" K-Style', '6" Fascia', 'Custom Colors'],
  },
]

function ServiceCard({ service, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        cursor: 'default',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--gold-line)'
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,169,110,0.1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Gold accent top bar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, var(--gold) 0%, transparent 60%)',
        opacity: 0,
        transition: 'opacity 0.3s',
      }} className="card-accent-bar" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '3rem',
          fontWeight: 700,
          color: 'var(--text-subtle)',
          lineHeight: 1,
          userSelect: 'none',
        }}>{service.num}</span>
        <span className="label" style={{ color: 'var(--gold)', textAlign: 'right' }}>
          {service.sub}
        </span>
      </div>

      <h3 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.4rem',
        fontWeight: 700,
        color: 'var(--text)',
        lineHeight: 1.2,
      }}>{service.title}</h3>

      <p style={{
        fontSize: '0.88rem',
        color: 'var(--text-muted)',
        lineHeight: 1.75,
        flexGrow: 1,
      }}>{service.desc}</p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        {service.tags.map(tag => (
          <span key={tag} style={{
            fontSize: '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '0.3rem 0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '2px',
            color: 'var(--text-muted)',
          }}>{tag}</span>
        ))}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginTop: '0.5rem',
        fontSize: '0.72rem',
        fontWeight: 500,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
      }}>
        Learn More
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </motion.div>
  )
}

export default function Services() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="services" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      <SectionBackground
        images={SERVICES_IMAGES}
        gradient="linear-gradient(135deg, rgba(8,12,20,0.90) 0%, rgba(8,12,20,0.78) 100%)"
      />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '4rem' }}>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="gold-line" />
            <span className="label">What We Do</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="section-title"
            style={{ marginTop: '1rem', maxWidth: '560px' }}
          >
            Complete Exterior <em>Solutions</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              marginTop: '1.2rem',
              fontSize: '0.95rem',
              color: 'var(--text-muted)',
              lineHeight: 1.8,
              maxWidth: '500px',
            }}
          >
            One contractor for every exterior need. No handoffs, no finger-pointing.
            From the first estimate to the final walkthrough, we own the entire project.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5px',
          background: 'var(--border)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.num} service={s} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
