import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { engine } from '../lib/engine'
import { noteToX } from '../lib/notes'

// Very subtle background: small 3D eighth notes in greys and the logo red, tumbling slowly
// in different orientations. They flare and drift when keys are played, on scroll and on button clicks.
const COUNT = 22
const ACCENT = new THREE.Color('#b3202c')
const PALETTE = ['#cfc9c4', '#dcd7d2', '#bdb7b2', '#e6e2de', '#cfc9c4', '#b3202c', '#8a1020']
const REDUCED = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function noteGeometry() {
  const head = new THREE.SphereGeometry(0.32, 20, 14)
  head.scale(1.25, 0.85, 0.5)
  head.rotateZ(0.35)
  const stem = new THREE.BoxGeometry(0.07, 1.5, 0.07)
  stem.translate(0.36, 0.75, 0)
  const flag = new THREE.BoxGeometry(0.5, 0.09, 0.07)
  flag.rotateZ(-0.7)
  flag.translate(0.6, 1.35, 0)
  const g = mergeGeometries([head, stem, flag])
  g.center()
  return g
}

function Notes() {
  const mesh = useRef()
  const { camera } = useThree()
  const geometry = useMemo(noteGeometry, [])
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const color = useMemo(() => new THREE.Color(), [])
  const base = useMemo(() => PALETTE.map((c) => new THREE.Color(c)), [])

  const notes = useMemo(() => Array.from({ length: COUNT }, (_, i) => ({
    x: (Math.random() - 0.5) * 24,
    y: (Math.random() - 0.5) * 16,
    z: -7 + Math.random() * 9,
    vy: 0.12 + Math.random() * 0.22,
    scale: 0.28 + Math.random() * 0.34,
    rx: Math.random() * Math.PI * 2, ry: Math.random() * Math.PI * 2, rz: Math.random() * Math.PI * 2,
    sx: (Math.random() - 0.5) * 0.35, sy: (Math.random() - 0.5) * 0.45, sz: (Math.random() - 0.5) * 0.25,
    phase: Math.random() * 10,
    color: base[i % base.length],
    boost: 0, kick: 0, ox: 0, vx: 0,
    wx: 0, wy: 0, wz: 0,
  })), [base])

  const scroll = useRef({ y: window.scrollY, offset: 0 })

  // Nudge notes near a point on screen (ndc), or along a vertical band when ndcY is null.
  const pulse = useRef(() => {})
  pulse.current = (ndcX, ndcY, radius, strength) => {
    if (REDUCED) return
    for (const n of notes) {
      tmp.set(n.wx, n.wy, n.wz).project(camera)
      const dist = ndcY == null ? Math.abs(tmp.x - ndcX) : Math.hypot(tmp.x - ndcX, tmp.y - ndcY)
      const f = Math.max(0, 1 - dist / radius)
      n.boost = Math.min(1.4, n.boost + strength * (0.12 + f))
      n.kick += strength * f * 1.6
      n.vx += (tmp.x >= ndcX ? 1 : -1) * strength * f * 1.2
    }
  }

  useEffect(() => {
    const onKey = ({ note }) => {
      const x = noteToX[note]
      if (x != null) pulse.current(x / 7.6, null, 0.45, 0.55)
    }
    const off = engine.subscribe((e) => onKey(e))
    const onDown = (e) => {
      if (!e.target.closest?.('button, a')) return
      pulse.current((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1, 0.7, 0.8)
    }
    const onScroll = () => {
      const dy = Math.abs(window.scrollY - scroll.current.y)
      scroll.current.y = window.scrollY
      if (REDUCED) return
      for (const n of notes) n.boost = Math.min(1.2, n.boost + dy * 0.0014)
    }
    window.addEventListener('pointerdown', onDown, true)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { off(); window.removeEventListener('pointerdown', onDown, true); window.removeEventListener('scroll', onScroll) }
  }, [notes])

  useFrame(({ clock }, dtRaw) => {
    const d = Math.min(dtRaw, 0.05)
    const t = clock.elapsedTime
    const m = mesh.current
    const target = window.scrollY * 0.0016
    scroll.current.offset += (target - scroll.current.offset) * Math.min(1, d * 3)
    const offset = scroll.current.offset
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    const fit = Math.min(1, camera.aspect * 0.9 + 0.1) // smaller notes on narrow phone screens

    notes.forEach((n, i) => {
      n.boost *= Math.exp(-d * 2.2)
      n.kick *= Math.exp(-d * 3)
      n.vx *= Math.exp(-d * 2.5)
      if (!REDUCED) {
        const speed = 1 + n.boost * 5
        n.y += (n.vy * (1 + n.boost * 3) + n.kick) * d
        n.ox += n.vx * d
        n.rx += n.sx * d * speed; n.ry += n.sy * d * speed; n.rz += n.sz * d * speed
      }
      const halfH = tanHalf * (camera.position.z - n.z) * 1.15
      const halfW = halfH * camera.aspect
      const ey = n.y + offset
      if (ey > halfH + 1) n.y -= 2 * halfH + 2
      else if (ey < -halfH - 1) n.y += 2 * halfH + 2
      n.ox *= Math.exp(-d * 0.6)

      n.wx = n.x + n.ox + Math.sin(t * 0.2 + n.phase) * 0.3
      n.wy = n.y + offset
      n.wz = n.z
      // keep x inside the view at this depth
      n.wx = ((n.wx + halfW) % (2 * halfW) + 2 * halfW) % (2 * halfW) - halfW

      dummy.position.set(n.wx, n.wy, n.wz)
      dummy.rotation.set(n.rx, n.ry, n.rz)
      dummy.scale.setScalar(n.scale * fit * (1 + Math.min(n.boost, 1) * 0.25))
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
      color.copy(n.color).lerp(ACCENT, Math.min(1, n.boost * 0.9))
      m.setColorAt(i, color)
    })
    m.instanceMatrix.needsUpdate = true
    m.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, COUNT]} frustumCulled={false}>
      <meshStandardMaterial transparent opacity={0.24} roughness={0.55} depthWrite={false} />
    </instancedMesh>
  )
}

export default function Ambient({ dim = false }) {
  return (
    <div className={`ambient ${dim ? 'dim' : ''}`} aria-hidden="true">
      <Canvas camera={{ fov: 40, position: [0, 0, 12] }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}>
        <ambientLight intensity={1.3} />
        <directionalLight position={[3, 5, 6]} intensity={1.4} />
        <Notes />
      </Canvas>
    </div>
  )
}
