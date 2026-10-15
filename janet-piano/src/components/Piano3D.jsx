import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { KEYS, KEYBOARD_MAP, noteToX } from '../lib/notes'
import { engine } from '../lib/engine'
import { unlockAudio } from '../lib/audio'

// Top-down (90 degree) orthographic view: x runs across the screen, z runs down it.
// Key backs sit at the top edge of the screen (z = 0); fronts point down the page.
const KEY_LEN = 3.2
const HIT_Z = KEY_LEN + 0.45
const LANE_GAP = 2.2
const SPAWN_Z = HIT_Z + 26
const POOL = 6
const WORLD_W = 16 // world units that span the full screen width

function Key({ k }) {
  const mat = useRef()
  const len = k.black ? KEY_LEN * 0.62 : KEY_LEN
  const w = k.black ? 0.58 : 0.94

  useFrame((_, dt) => {
    const now = performance.now()
    const on = (engine.active.get(k.note) || 0) > 0
    const isGold = (engine.gold.get(k.note) || 0) > now
    const m = mat.current
    const target = isGold ? 1 : on ? 0.8 : 0
    m.emissiveIntensity += (target - m.emissiveIntensity) * Math.min(1, dt * 18)
    m.emissive.set(isGold ? '#ffc94d' : '#e0404f')
  })

  return (
    <group position={[k.x, k.black ? 0.2 : 0, 0]}>
      {k.black && (
        // soft drop shadow so black keys read as raised
        <mesh position={[0.07, -0.1, len / 2 + 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w, len]} />
          <meshBasicMaterial color="#000" transparent opacity={0.35} />
        </mesh>
      )}
      <mesh position={[0, 0, len / 2]} rotation={[-Math.PI / 2, 0, 0]} userData={{ note: k.note }}>
        <planeGeometry args={[w, len]} />
        <meshStandardMaterial ref={mat} color={k.black ? '#111' : '#f8f2ec'} emissive="#e0404f" emissiveIntensity={0} roughness={0.6} />
      </mesh>
    </group>
  )
}

// Upcoming notes rise from the bottom of the screen toward their key.
function RisingNotes({ practice }) {
  const refs = useRef([])
  const meta = useRef(Array.from({ length: POOL }, () => ({ step: -1, z: SPAWN_Z })))

  useFrame((_, dt) => {
    const { active, step, notes } = practice.current
    refs.current.forEach((m) => m && (m.visible = false))
    if (!active) return
    for (let s = step; s < Math.min(notes.length, step + 6); s++) {
      const slot = s % POOL
      const mesh = refs.current[slot]
      const m = meta.current[slot]
      if (m.step !== s) { m.step = s; m.z = SPAWN_Z }
      const targetZ = HIT_Z + (s - step) * LANE_GAP
      m.z += (targetZ - m.z) * Math.min(1, dt * 4)
      mesh.visible = true
      mesh.position.set(noteToX[notes[s][0]], 0.5, m.z)
      const first = s === step
      mesh.scale.set(first ? 1 + Math.sin(performance.now() / 160) * 0.07 : 1, 1, 1)
      const mat = mesh.material
      mat.color.set(first ? '#ffc94d' : '#b3202c')
      mat.opacity = first ? 1 : Math.max(0.2, 0.75 - (s - step) * 0.12)
    }
  })

  return (
    <group>
      {KEYS.filter((k) => !k.black).map((k) => (
        <mesh key={k.note} position={[k.x + 0.47, 0.01, KEY_LEN + 20]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.012, 40]} />
          <meshBasicMaterial color="#caa76a" transparent opacity={0.1} />
        </mesh>
      ))}
      {Array.from({ length: POOL }, (_, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} visible={false} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.8, 1.3]} />
          <meshBasicMaterial transparent toneMapped={false} />
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
        s.pos.set([x + (Math.random() - 0.5) * 0.5, 1, KEY_LEN * 0.6 + (Math.random() - 0.5) * 1.5], i * 3)
        const a = Math.random() * Math.PI * 2
        const sp = 1.5 + Math.random() * 3.5
        s.vel.set([Math.cos(a) * sp, 0, Math.sin(a) * sp], i * 3)
        s.life[i] = 1
      }
    }
    for (let i = 0; i < BURST_N; i++) {
      const l = s.life[i]
      if (l <= 0) { s.col[i * 3] = s.col[i * 3 + 1] = s.col[i * 3 + 2] = 0; continue }
      s.life[i] = l - dt * 1.5
      s.pos[i * 3] += s.vel[i * 3] * dt
      s.pos[i * 3 + 2] += s.vel[i * 3 + 2] * dt
      s.vel[i * 3] *= 1 - dt * 2
      s.vel[i * 3 + 2] *= 1 - dt * 2
      const f = Math.max(0, s.life[i])
      s.col[i * 3] = f; s.col[i * 3 + 1] = 0.78 * f; s.col[i * 3 + 2] = 0.3 * f
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
      <pointsMaterial size={4} sizeAttenuation={false} vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
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

// Straight-down orthographic camera; the keys always span the full screen width
// and the key backs are pinned to the top edge of the canvas.
function CameraRig() {
  const { camera, size } = useThree()
  useEffect(() => {
    const zoom = size.width / WORLD_W
    camera.zoom = zoom
    camera.up.set(0, 0, -1)
    camera.position.set(0, 10, -0.15 + size.height / (2 * zoom))
    camera.lookAt(0, 0, camera.position.z)
    camera.updateProjectionMatrix()
  }, [camera, size])
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
    // pan-y keeps vertical page scrolling working on touch; horizontal drags play glissandos.
    <Canvas orthographic camera={{ near: 0.1, far: 50 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }} style={{ touchAction: 'pan-y' }}>
      <ambientLight intensity={1.6} />
      <directionalLight position={[2, 10, 3]} intensity={1.2} />
      <CameraRig />
      <group ref={keysRef}>{KEYS.map((k) => <Key key={k.note} k={k} />)}</group>
      <RisingNotes practice={practice} />
      <Bursts />
      <PointerInput keysRef={keysRef} />
    </Canvas>
  )
}
