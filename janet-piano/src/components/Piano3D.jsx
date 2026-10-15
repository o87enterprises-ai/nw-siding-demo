import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { KEYS, KEYBOARD_MAP, noteToX } from '../lib/notes'
import { engine } from '../lib/engine'
import { unlockAudio } from '../lib/audio'

const BACK_Z = -2.5
const HIT_Z = BACK_Z - 0.5
const LANE_GAP = 2.3
const POOL = 6

function Key({ k }) {
  const group = useRef()
  const mat = useRef()
  const len = k.black ? 3.1 : 5
  const w = k.black ? 0.58 : 0.94
  const h = k.black ? 0.55 : 0.5
  const y = k.black ? 0.075 : -0.25

  useFrame((_, dt) => {
    const now = performance.now()
    const on = (engine.active.get(k.note) || 0) > 0
    const isGold = (engine.gold.get(k.note) || 0) > now
    const rot = group.current.rotation
    rot.x += ((on ? 0.07 : 0) - rot.x) * Math.min(1, dt * 30)
    const m = mat.current
    const target = isGold ? 1.4 : on ? 0.75 : 0
    m.emissiveIntensity += (target - m.emissiveIntensity) * Math.min(1, dt * 16)
    m.emissive.set(isGold ? '#ffc94d' : '#e0404f')
  })

  return (
    <group ref={group} position={[k.x, 0, BACK_Z]}>
      <RoundedBox args={[w, h, len]} radius={0.05} smoothness={3} position={[0, y, len / 2]} userData={{ note: k.note }}>
        <meshStandardMaterial ref={mat} color={k.black ? '#161213' : '#f8f2ec'} roughness={k.black ? 0.35 : 0.5} metalness={k.black ? 0.2 : 0} emissive="#e0404f" emissiveIntensity={0} />
      </RoundedBox>
    </group>
  )
}

function Body() {
  return (
    <group>
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[15.4, 0.6, 5.6]} />
        <meshStandardMaterial color="#2a0a0e" roughness={0.4} metalness={0.3} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 7.9, -0.1, 0]}>
          <boxGeometry args={[0.7, 1.5, 5.8]} />
          <meshStandardMaterial color="#5a0c14" roughness={0.3} metalness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.2, BACK_Z - 0.35]}>
        <boxGeometry args={[15.4, 0.9, 0.7]} />
        <meshStandardMaterial color="#3b0a10" roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.66, BACK_Z - 0.01]}>
        <boxGeometry args={[15.1, 0.04, 0.06]} />
        <meshStandardMaterial color="#caa76a" emissive="#caa76a" emissiveIntensity={0.5} metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  )
}

// Synthesia-style lane: upcoming notes slide toward the keys.
function FallingNotes({ practice }) {
  const refs = useRef([])
  const meta = useRef(Array.from({ length: POOL }, () => ({ step: -1, z: -20 })))

  useFrame((_, dt) => {
    const { active, step, notes } = practice.current
    for (let i = 0; i < POOL; i++) {
      const mesh = refs.current[i]
      if (!mesh) continue
      mesh.visible = false
    }
    if (!active) return
    for (let s = step; s < Math.min(notes.length, step + 5); s++) {
      const slot = s % POOL
      const mesh = refs.current[slot]
      const m = meta.current[slot]
      if (m.step !== s) { m.step = s; m.z = -20 }
      const targetZ = HIT_Z - (s - step) * LANE_GAP
      m.z += (targetZ - m.z) * Math.min(1, dt * 5)
      const note = notes[s][0]
      mesh.visible = true
      mesh.position.set(noteToX[note], 0.18, m.z)
      const first = s === step
      const pulse = first ? 1 + Math.sin(performance.now() / 160) * 0.08 : 1
      mesh.scale.set(pulse, 1, 1)
      const mat = mesh.material
      mat.color.set(first ? '#ffc94d' : '#b3202c')
      mat.emissive.set(first ? '#ffb300' : '#7d1019')
      mat.emissiveIntensity = first ? 1.1 : 0.5
      mat.opacity = first ? 0.95 : Math.max(0.15, 0.7 - (s - step) * 0.15)
    }
  })

  return (
    <group>
      <mesh position={[0, -0.02, -9]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15.4, 14]} />
        <meshBasicMaterial color="#0c0506" transparent opacity={0.55} />
      </mesh>
      {KEYS.filter((k) => !k.black).map((k) => (
        <mesh key={k.note} position={[k.x + 0.47, 0, -9]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.012, 14]} />
          <meshBasicMaterial color="#caa76a" transparent opacity={0.12} />
        </mesh>
      ))}
      {Array.from({ length: POOL }, (_, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} visible={false}>
          <boxGeometry args={[0.8, 0.3, 1.5]} />
          <meshStandardMaterial transparent toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

const BURST_N = 260
function Bursts() {
  const pts = useRef()
  const state = useMemo(() => ({
    pos: new Float32Array(BURST_N * 3),
    col: new Float32Array(BURST_N * 3),
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
        s.pos.set([x + (Math.random() - 0.5) * 0.6, 0.4, BACK_Z + 1 + Math.random() * 2], i * 3)
        const a = Math.random() * Math.PI * 2
        const sp = 1 + Math.random() * 2.5
        s.vel.set([Math.cos(a) * sp * 0.8, 2.5 + Math.random() * 3.5, Math.sin(a) * sp * 0.6], i * 3)
        s.life[i] = 1
      }
    }
    for (let i = 0; i < BURST_N; i++) {
      const l = s.life[i]
      if (l <= 0) { s.col[i * 3] = s.col[i * 3 + 1] = s.col[i * 3 + 2] = 0; continue }
      s.life[i] = l - dt * 1.4
      s.vel[i * 3 + 1] -= 7 * dt
      for (let a = 0; a < 3; a++) s.pos[i * 3 + a] += s.vel[i * 3 + a] * dt
      const f = Math.max(0, s.life[i])
      s.col[i * 3] = 1 * f; s.col[i * 3 + 1] = 0.78 * f; s.col[i * 3 + 2] = 0.3 * f
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
      <pointsMaterial size={0.16} vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
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

function CameraRig() {
  const { camera, size } = useThree()
  useFrame(({ clock }) => {
    const aspect = size.width / size.height
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2)
    const dist = Math.max(14, 9.2 / (Math.tan(halfFov) * aspect) + 3)
    const t = clock.elapsedTime
    camera.position.set(Math.sin(t * 0.25) * 0.5, dist * 0.72, dist * 0.62 + 2)
    camera.lookAt(0, 0, -3.2)
  })
  return null
}

export default function Piano3D({ practice }) {
  const keysRef = useRef()
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
    <Canvas camera={{ fov: 40, position: [0, 9, 11] }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }} style={{ touchAction: 'none' }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 10, 6]} intensity={2.2} color="#fff1dc" />
      <pointLight position={[0, 4, -6]} intensity={30} color="#b3202c" />
      <CameraRig />
      <Body />
      <group ref={keysRef}>{KEYS.map((k) => <Key key={k.note} k={k} />)}</group>
      <FallingNotes practice={practice} />
      <Bursts />
      <PointerInput keysRef={keysRef} />
    </Canvas>
  )
}
