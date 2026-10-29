import { useCallback, useEffect, useRef, useState } from 'react'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import { galleryPhotos, galleryPage } from '../content/gallery'

const crumbLink = { color: 'var(--text-muted)', textDecoration: 'underline', textUnderlineOffset: '3px' }
const subTitle = { fontSize: 'clamp(1.4rem, 3vw, 2rem)', margin: '3.5rem 0 1.4rem' }

// Rendered widths: 1 column on phones, 2 from 561px, 3 (projects) from 900px; the page maxes out at 1200px.
const SIZES_2COL = '(min-width: 561px) 50vw, 100vw'
const SIZES_3COL = '(min-width: 900px) 33vw, (min-width: 561px) 50vw, 100vw'
const src = (p, size) => `/gallery/${p.id}-${size}.webp`
const beforeAfter = galleryPhotos.filter((p) => p.group === 'ba')
const projects = galleryPhotos.filter((p) => p.group !== 'ba')

function Photo({ photo, index, onOpen, priority, sizes }) {
  return (
    <button type="button" className="gallery-tile" onClick={() => onOpen(index)} aria-label={`Enlarge photo: ${photo.alt}`}>
      <img
        src={src(photo, 'sm')}
        srcSet={photo.lw > photo.w ? `${src(photo, 'sm')} ${photo.w}w, ${src(photo, 'lg')} ${photo.lw}w` : undefined}
        sizes={sizes}
        alt={photo.alt}
        width={photo.w}
        height={photo.h}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </button>
  )
}

function Lightbox({ index, onClose, onStep }) {
  const photo = galleryPhotos[index]
  const closeRef = useRef(null)

  useEffect(() => {
    const previous = document.activeElement
    closeRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onStep(1)
      else if (e.key === 'ArrowLeft') onStep(-1)
      else if (e.key === 'Tab') {
        // Keep focus inside the dialog.
        const f = [...document.querySelectorAll('.lightbox button')]
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      previous?.focus?.()
    }
  }, [onClose, onStep])

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={onClose}>
      <button ref={closeRef} type="button" className="lightbox-btn lightbox-close" onClick={onClose} aria-label="Close">×</button>
      <button type="button" className="lightbox-btn lightbox-prev" onClick={(e) => { e.stopPropagation(); onStep(-1) }} aria-label="Previous photo">‹</button>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={src(photo, 'lg')} alt={photo.alt} width={photo.lw} height={photo.lh} />
        <figcaption>
          {photo.alt}
          <span> · {index + 1} / {galleryPhotos.length}</span>
        </figcaption>
      </figure>
      <button type="button" className="lightbox-btn lightbox-next" onClick={(e) => { e.stopPropagation(); onStep(1) }} aria-label="Next photo">›</button>
    </div>
  )
}

export default function GalleryPage() {
  const page = galleryPage
  const [open, setOpen] = useState(null)
  const indexOf = (p) => galleryPhotos.indexOf(p)
  const close = useCallback(() => setOpen(null), [])
  const step = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + galleryPhotos.length) % galleryPhotos.length)), [])

  return (
    <div style={{ position: 'relative' }}>
      <main
        style={{
          background: 'var(--bg)',
          padding: 'calc(var(--nav-h, 76px) + clamp(2.5rem, 5vw, 4rem)) clamp(1.5rem, 6vw, 6rem) clamp(3rem, 6vw, 5rem)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <nav aria-label="Breadcrumb" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            <a href="/" style={crumbLink}>Home</a>
            {' / '}
            <span aria-current="page">{page.breadcrumb[0]}</span>
          </nav>

          <span className="gold-line" />
          <span className="label">{page.kicker}</span>
          <h1 className="section-title" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>{page.h1}</h1>
          <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', lineHeight: 1.85, maxWidth: '760px' }}>{page.intro}</p>
          <div style={{ marginTop: '1.8rem' }}>
            <a href="#contact" className="btn-primary">Start Your Project</a>
          </div>

          <h2 className="section-title" style={subTitle}>Before &amp; <em>After</em></h2>
          <div className="gallery-masonry gallery-masonry-2">
            {beforeAfter.map((p, i) => (
              <Photo key={p.id} photo={p} index={indexOf(p)} onOpen={setOpen} priority={i < 2} sizes={SIZES_2COL} />
            ))}
          </div>

          <h2 className="section-title" style={subTitle}>Finished &amp; <em>In Progress</em></h2>
          <div className="gallery-masonry">
            {projects.map((p) => (
              <Photo key={p.id} photo={p} index={indexOf(p)} onOpen={setOpen} sizes={SIZES_3COL} />
            ))}
          </div>
        </div>
      </main>

      {open !== null && <Lightbox index={open} onClose={close} onStep={step} />}

      <Contact />
      <Footer />
    </div>
  )
}
