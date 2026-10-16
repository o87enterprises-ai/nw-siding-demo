import { useId } from 'react'

export default function WaxSeal({ size = 160, className = '' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 200 200" role="img" aria-label="JH wax seal">
      <defs>
        <filter id={`${id}w`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="12" />
        </filter>
        <radialGradient id={`${id}g`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#c8303c" />
          <stop offset="0.55" stopColor="#8e1520" />
          <stop offset="1" stopColor="#4d0710" />
        </radialGradient>
        <filter id={`${id}e`}>
          <feDropShadow dx="-1" dy="-1.5" stdDeviation="0.8" floodColor="#000" floodOpacity="0.55" />
        </filter>
      </defs>
      <g filter={`url(#${id}w)`}>
        <circle cx="100" cy="100" r="86" fill={`url(#${id}g)`} />
      </g>
      <circle cx="100" cy="100" r="64" fill="none" stroke="#3d050c" strokeWidth="3" opacity="0.7" />
      <circle cx="100" cy="100" r="62" fill="none" stroke="#d94a56" strokeWidth="1.5" opacity="0.5" />
      <text x="100" y="124" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="76" fontWeight="700" fill="#a51d29" filter={`url(#${id}e)`} stroke="#5d0a13" strokeWidth="0.8">
        JH
      </text>
      <path d="M52 50 A68 68 0 0 1 100 32" stroke="#ff8a93" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.35" />
    </svg>
  )
}
