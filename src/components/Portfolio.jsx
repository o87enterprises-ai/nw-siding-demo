import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import SectionBackground from './SectionBackground'
import { galleryPhotos } from '../content/gallery'

const PORTFOLIO_IMAGES = [
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1590486803833-1b5dc97207f2?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1604079628040-94301bb21b91?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1920&q=80',
]

// Six photos from the gallery page (ids in src/content/gallery.js). Each tile opens the full gallery.
const FEATURED_IDS = ['06', '07', '08', '10', '11', '12']
const FEATURED = FEATURED_IDS.map((id) => galleryPhotos.find((p) => p.id === id))

function ProjectCard({ photo, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.a
      ref={ref}
      href="/gallery/"
      aria-label={`View the project gallery: ${photo.alt}`}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative',
        display: 'block',
        borderRadius: '3px',
        overflow: 'hidden',
        aspectRatio: '4/3',
        background: 'var(--surface-2)',
      }}
    >
      <img
        src={`/gallery/${photo.id}-sm.webp`}
        alt={photo.alt}
        width={photo.w}
        height={photo.h}
        loading="lazy"
        decoding="async"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </motion.a>
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

        {/* Featured photos */}
        <div className="portfolio-grid">
          {FEATURED.map((photo, i) => (
            <ProjectCard key={photo.id} photo={photo} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  )
}
