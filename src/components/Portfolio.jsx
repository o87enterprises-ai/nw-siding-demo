import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionBackground from './SectionBackground'

const PORTFOLIO_IMAGES = [
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1590486803833-1b5dc97207f2?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1604079628040-94301bb21b91?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1920&q=80',
]

const PROJECTS = [
  {
    title: 'James Hardie Installation',
    location: 'Eugene, OR',
    type: 'Fiber Cement Siding',
    bg: 'linear-gradient(135deg, #2A2D34 0%, #363840 100%)',
    size: 'large',
  },
  {
    title: 'Cedar Shingle Replacement',
    location: 'Springfield, OR',
    type: 'Cedar Shingles',
    bg: 'linear-gradient(135deg, #3D3128 0%, #4E4035 100%)',
    size: 'small',
  },
  {
    title: 'Complete Exterior Remodel',
    location: 'Albany, OR',
    type: 'Hardie + Windows + Gutters',
    bg: 'linear-gradient(135deg, #C4BCAF 0%, #D4CCC0 100%)',
    size: 'small',
  },
  {
    title: 'Window Replacement',
    location: 'Eugene, OR',
    type: 'Milgard Tuscany® Series',
    bg: 'linear-gradient(135deg, #445040 0%, #556050 100%)',
    size: 'small',
  },
  {
    title: 'Seamless Steel Gutters',
    location: 'Creswell, OR',
    type: '6" Fascia-Style',
    bg: 'linear-gradient(135deg, #1C2635 0%, #253040 100%)',
    size: 'small',
  },
  {
    title: 'HardiePlank® Installation',
    location: 'Roseburg, OR',
    type: 'Fiber Cement · Lap Siding',
    bg: 'linear-gradient(135deg, #E8E2DA 0%, #F0EBE3 100%)',
    size: 'large',
  },
]

function ProjectCard({ project, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const isLarge = project.size === 'large'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      style={{
        gridColumn: isLarge ? 'span 2' : 'span 1',
        position: 'relative',
        borderRadius: '3px',
        overflow: 'hidden',
        aspectRatio: isLarge ? '16/7' : '4/3',
        cursor: 'pointer',
        background: project.bg,
      }}
    >
      {/* Overlay */}
      <motion.div
        variants={{ hover: { opacity: 1 } }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(0deg, rgba(8,12,20,0.85) 0%, rgba(8,12,20,0.2) 50%, transparent 100%)',
          zIndex: 1,
        }}
      />

      {/* Demo label (remove with real photos) */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '0.6rem',
        fontWeight: 500,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.12)',
        whiteSpace: 'nowrap',
        zIndex: 0,
        userSelect: 'none',
      }}>
        Photo Placeholder
      </div>

      {/* Content */}
      <motion.div
        variants={{ hover: { y: 0, opacity: 1 } }}
        initial={{ y: 10, opacity: 0.7 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '1.5rem 1.8rem',
          zIndex: 2,
        }}
      >
        <div className="label" style={{ marginBottom: '0.4rem', color: 'var(--gold)' }}>
          {project.type}
        </div>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'var(--white)',
          marginBottom: '0.2rem',
        }}>{project.title}</div>
        <div style={{
          fontSize: '0.72rem',
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: '0.08em',
        }}>{project.location}</div>
      </motion.div>

      {/* Arrow icon */}
      <motion.div
        variants={{ hover: { opacity: 1, scale: 1 } }}
        initial={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'absolute',
          top: '1.2rem', right: '1.2rem',
          width: '36px', height: '36px',
          borderRadius: '50%',
          border: '1px solid rgba(201,169,110,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 10L10 2M10 2H4M10 2v6" stroke="var(--gold)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </motion.div>
  )
}

export default function Portfolio() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="portfolio"
      className="section"
      style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}
    >
      <SectionBackground
        images={PORTFOLIO_IMAGES}
        gradient="linear-gradient(160deg, rgba(8,12,20,0.92) 0%, rgba(13,18,32,0.80) 100%)"
      />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          gap: '2rem',
        }}>
          <div ref={ref}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="gold-line" />
              <span className="label">Our Work</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="section-title"
              style={{ marginTop: '1rem' }}
            >
              2,000+ Homes, <em>Transformed</em>
            </motion.h2>
          </div>

          <motion.a
            href="/gallery/"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="btn-ghost"
          >
            View Full Gallery
          </motion.a>
        </div>

        {/* Masonry-style grid */}
        <div className="portfolio-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
        }}>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={i} project={p} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  )
}
