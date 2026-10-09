import o87Logo from '../assets/o87-logo.png'
import o87Tile from '../assets/o87-watermark-tile.png'

/* Official o87 Enterprises logo */
export function O87Logo({ height = 40, style }) {
  return (
    <img
      src={o87Logo}
      alt="o87 Enterprises"
      style={{ height, width: 'auto', display: 'block', ...style }}
    />
  )
}

/* Barely-visible tiled logo pattern. Sits over the page, never intercepts clicks. */
export function O87Watermark({ opacity = 0.045 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
        backgroundImage: `url(${o87Tile})`,
        backgroundSize: 'clamp(300px, 36vw, 460px) auto',
        backgroundRepeat: 'repeat',
        opacity,
      }}
    />
  )
}

/* "Property of o87Enterprises" line shown at the bottom of every page */
export function O87Credit({ style }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '0.6rem', padding: '1rem 1.5rem',
      fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase',
      color: 'var(--text-subtle)', textAlign: 'center', flexWrap: 'wrap',
      ...style,
    }}>
      <O87Logo height={22} />
      <span>Property of o87Enterprises</span>
    </div>
  )
}
