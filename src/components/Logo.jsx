import nwLogo from '../assets/nw-logo.png'

/* Full logo image (mark + wordmark + tagline) */
export default function Logo({ size = 44, showTagline = true, showBackground = false }) {
  return (
    <img
      src={nwLogo}
      alt="NW Siding — Exteriors Elevated"
      width={size}
      height={size}
      style={{
        width: 'auto',
        height: size,
        objectFit: 'contain',
        display: 'block',
        flexShrink: 0,
        borderRadius: size * 0.08,
      }}
    />
  )
}

/* Stand-alone mark — for covers, watermarks, compact spots */
export function LogoMark({ size = 80 }) {
  return (
    <img
      src={nwLogo}
      alt=""
      aria-hidden="true"
      style={{
        height: size,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
        flexShrink: 0,
        borderRadius: size * 0.08,
      }}
    />
  )
}
