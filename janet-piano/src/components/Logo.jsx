import WaxSeal from './WaxSeal'

// Uses src/assets/logo.* when present, otherwise the placeholder wax seal.
const found = import.meta.glob('../assets/logo.*', { eager: true, query: '?url', import: 'default' })
const src = Object.values(found)[0]

export default function Logo({ size = 64, className = '' }) {
  if (!src) return <WaxSeal size={size} className={className} />
  return <img src={src} alt="Janet Holmes logo" className={className} style={{ width: size, height: 'auto', display: 'block' }} />
}
