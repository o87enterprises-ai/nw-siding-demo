import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Edges } from '@react-three/drei'
import * as THREE from 'three'
import { KEYS, KEYBOARD_MAP, noteToX } from '../lib/notes'
import { engine } from '../lib/engine'
import { unlockAudio } from '../lib/audio'

// Top-down (90 degree) orthographic view: x runs across the screen, z runs down it.
// Key backs sit at the top edge of the screen (z = 0); fronts point down the page.
// Taller keys on portrait phones so the piano is comfortable to play (CSS --piano-h matches).
const L = { keyLen: 3.2 }
const hitZ = () => L.keyLen + 0.45
const LANE_GAP = 2.2
const POOL = 6
const WORLD_W = 16 // world units that span the full screen width

const WHITE = new THREE.Color('#ffffff')
const INK = new THREE.Color('#16100f')
const ACCENT = new THREE.Color('#b3202c')

function Key({ k }) {
  const group = useRef()
  const mat = useRef()
  const amt = useRef(0)
  const len = k.black ? L.keyLen * 0.62 : L.keyLen
  const w = k.black ? 0.58 : 0.94
  const h = k.black ? 0.62 : 0.5

  useFrame((_, dt) => {
    const now = performance.now()
    const on = (engine.active.get(k.note) || 0) > 0
    const lit = (engine.gold.get(k.note) || 0) > now
    const target = lit ? 1 : on ? 0.75 : 0
    amt.current += (target - amt.current) * Math.min(1, dt * 18)
    const m = mat.current
    m.color.lerpColors(k.black ? INK : WHITE, ACCENT, amt.current)
    m.emissive.copy(ACCENT)
    m.emissiveIntensity = amt.current * 0.55
    const rot = group.current.rotation
    rot.x += ((on || lit ? 0.05 : 0) - rot.x) * Math.min(1, dt * 24)
  })

  return (
    <group ref={group} position={[k.x, 0, 0]}>
      <RoundedBox args={[w, h, len]} radius={k.black ? 0.07 : 0.05} smoothness={3} position={[0, k.black ? 0.05 : -0.25, len / 2]} userData={{ note: k.note }}>
        <meshStandardMaterial ref={mat} color={k.black ? '#16100f' : '#ffffff'} roughness={k.black ? 0.28 : 0.45} metalness={k.black ? 0.25 : 0} toneMapped={false} />
        <Edges threshold={30} color="#b3202c" />
      </RoundedBox>
    </group>
  )
}

// Upcoming notes rise from the bottom of the screen toward their key.
function RisingNotes({ practice }) {
  const refs = useRef([])
  const meta = useRef(Array.from({ length: POOL }, () => ({ step: -1, z: 30 })))

  useFrame((_, dt) => {
    const { active, step, notes } = practice.current
    refs.current.forEach((m) => m && (m.visible = false))
    if (!active) return
    for (let s = step; s < Math.min(notes.length, step + 6); s++) {
      const slot = s % POOL
      const mesh = refs.current[slot]
      const m = meta.current[slot]
      if (m.step !== s) { m.step = s; m.z = hitZ() + 26 }
      const targetZ = hitZ() + (s - step) * LANE_GAP
      m.z += (targetZ - m.z) * Math.min(1, dt * 4)
      mesh.visible = true
      mesh.position.set(noteToX[notes[s][0]], 0.25, m.z)
      const first = s === step
      mesh.scale.set(first ? 1 + Math.sin(performance.now() / 160) * 0.07 : 1, 1, 1)
      const mat = mesh.material
      mat.color.set('#b3202c')
      mat.emissiveIntensity = first ? 0.8 : 0.4
      mat.opacity = first ? 1 : Math.max(0.18, 0.62 - (s - step) * 0.09)
    }
  })

  return (
    <group>
      {KEYS.filter((k) => !k.black).map((k) => (
        <mesh key={k.note} position={[k.x + 0.47, 0.01, L.keyLen + 20]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.012, 40]} />
          <meshBasicMaterial color="#b3202c" transparent opacity={0.08} />
        </mesh>
      ))}
      {Array.from({ length: POOL }, (_, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} visible={false}>
          <boxGeometry args={[0.8, 0.22, 1.25]} />
          <meshStandardMaterial transparent emissive="#b3202c" emissiveIntensity={0.5} color="#9c1625" roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

const BURST_N = 260
function Bursts() {
  const pts = useRef()
  const state = useMemo(() => ({
    pos: Float32Array.from({ length: BURST_N * 3 }, (_, i) => (i % 3 === 2 ? -100 : 0)), // idle particles parked offscreen
    col: new Float32Array(BURST_N * 3).fill(1),
    vel: new Float32Array(BURST_N * 3),
    life: new Float32Array(BURST_N),
    next: 0,
  }), [])

  useFrame((_, dt) => {
    const s = state
    while (engine.pendingBursts.length) {
      const x = noteToX[engine.pendingBursts.shift()]
      for (let n = 0; n < 34; n++) {
        const i = s.next++ % BURST_N
        s.pos.set([x + (Math.random() - 0.5) * 0.5, 1, L.keyLen * 0.6 + (Math.random() - 0.5) * 1.5], i * 3)
        const a = Math.random() * Math.PI * 2
        const sp = 1.5 + Math.random() * 3.5
        s.vel.set([Math.cos(a) * sp, 0, Math.sin(a) * sp], i * 3)
        s.life[i] = 1
      }
    }
    for (let i = 0; i < BURST_N; i++) {
      const l = s.life[i]
      if (l <= 0) { s.col[i * 3] = s.col[i * 3 + 1] = s.col[i * 3 + 2] = 1; s.pos[i * 3 + 2] = -100; continue }
      s.life[i] = l - dt * 1.5
      s.pos[i * 3] += s.vel[i * 3] * dt
      s.pos[i * 3 + 2] += s.vel[i * 3 + 2] * dt
      s.vel[i * 3] *= 1 - dt * 2
      s.vel[i * 3 + 2] *= 1 - dt * 2
      const f = Math.max(0, s.life[i])
      s.col[i * 3] = 1 - 0.3 * f; s.col[i * 3 + 1] = 1 - 0.88 * f; s.col[i * 3 + 2] = 1 - 0.85 * f
    }
    const g = pts.current.geometry
    g.attributes.position.needsUpdate = true
    g.attributes.color.needsUpdate = true
  })

  return (
    <points ref={pts} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[state.pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[state.col, 3]} />
      </bufferGeometry>
      <pointsMaterial size={4} sizeAttenuation={false} vertexColors depthWrite={false} toneMapped={false} />
    </points>
  )
}

// Raycasting input: mouse, multi-touch and glissando all share one code path.
function PointerInput({ keysRef }) {
  const { gl, camera } = useThree()
  useEffect(() => {
    const el = gl.domElement
    const ray = new THREE.Raycaster()
    const v = new THREE.Vector2()
    const held = new Map()

    const pick = (e) => {
      const r = el.getBoundingClientRect()
      v.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
      camera.updateMatrixWorld()
      ray.setFromCamera(v, camera)
      for (const hit of ray.intersectObjects(keysRef.current.children, true)) {
        for (let o = hit.object; o; o = o.parent) if (o.userData.note) return o.userData.note
      }
      return null
    }
    const release = (e) => {
      const n = held.get(e.pointerId)
      if (n) engine.noteOff(n)
      held.delete(e.pointerId)
    }
    const down = (e) => {
      unlockAudio()
      const n = pick(e)
      if (!n) return
      try { el.setPointerCapture(e.pointerId) } catch { /* ignore */ }
      held.set(e.pointerId, n)
      engine.noteOn(n, { source: 'user' })
    }
    const move = (e) => {
      if (!held.has(e.pointerId)) return
      const n = pick(e)
      if (n === held.get(e.pointerId)) return
      engine.noteOff(held.get(e.pointerId))
      if (n) { held.set(e.pointerId, n); engine.noteOn(n, { source: 'user' }) } else held.delete(e.pointerId)
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', release)
    el.addEventListener('pointercancel', release)
    el.addEventListener('lostpointercapture', release)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', release)
      el.removeEventListener('pointercancel', release)
      el.removeEventListener('lostpointercapture', release)
      held.forEach((n) => engine.noteOff(n))
    }
  }, [gl, camera, keysRef])
  return null
}

// Orthographic camera tilted a few degrees toward the player so key fronts and bevels show.
// Keys always span the full width and their backs are pinned just below the top edge of the canvas.
const TILT = THREE.MathUtils.degToRad(17)
const probe = new THREE.Vector3()
function CameraRig() {
  const { camera, size } = useThree()
  useEffect(() => {
    const zoom = size.width / WORLD_W
    const tz = size.height / (2 * zoom)
    camera.zoom = zoom
    camera.up.set(0, 0, -1)
    camera.position.set(0, Math.cos(TILT) * 20, tz + Math.sin(TILT) * 20)
    camera.lookAt(0, 0, tz)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
    const p = probe.set(0, 0.4, -0.1).project(camera)
    camera.translateY((p.y - (1 - 24 / size.height)) * (size.height / (2 * zoom)))
    camera.updateMatrixWorld()
  }, [camera, size])
  return null
}

const PORTRAIT = '(max-width: 760px) and (orientation: portrait)'

export default function Piano3D({ practice }) {
  const keysRef = useRef()
  const [portrait, setPortrait] = useState(() => window.matchMedia(PORTRAIT).matches)
  useEffect(() => {
    const mq = window.matchMedia(PORTRAIT)
    const on = () => setPortrait(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  L.keyLen = portrait ? 5.6 : 3.2
  useEffect(() => {
    const down = (e) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return
      const n = KEYBOARD_MAP[e.key.toLowerCase()]
      if (n) engine.noteOn(n, { source: 'user' })
    }
    const up = (e) => {
      const n = KEYBOARD_MAP[e.key.toLowerCase()]
      if (n) engine.noteOff(n)
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  return (
    // pan-y keeps vertical page scrolling working on touch; horizontal drags play glissandos.
    <Canvas orthographic camera={{ near: 0.1, far: 50 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }} style={{ touchAction: 'pan-y' }}>
      <CameraRig />
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 12, 9]} intensity={2.1} color="#fff6ee" />
      <directionalLight position={[-6, 6, -4]} intensity={0.7} color="#ffb3bd" />
      <pointLight position={[0, 4, 2]} intensity={14} color="#b3202c" distance={14} />
      <mesh position={[0, -0.12, L.keyLen / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15.3, L.keyLen + 0.3]} />
        <meshStandardMaterial color="#8c1623" transparent opacity={0.22} roughness={0.6} />
      </mesh>
      <group ref={keysRef}>{KEYS.map((k) => <Key key={`${k.note}${L.keyLen}`} k={k} />)}</group>
      <RisingNotes practice={practice} />
      <Bursts />
      <PointerInput keysRef={keysRef} />
    </Canvas>
  )
}
