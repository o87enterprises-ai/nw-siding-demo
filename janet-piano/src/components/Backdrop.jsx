import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

function glyphTexture(char) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  g.font = '96px "Cormorant Garamond", Georgia, serif'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillStyle = '#e2c48a'
  g.fillText(char, 64, 70)
  return new THREE.CanvasTexture(c)
}

// Music notes drifting upward.
function FloatingNotes({ char, count, size }) {
  const ref = useRef()
  const tex = useMemo(() => glyphTexture(char), [char])
  const data = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos.set([(Math.random() - 0.5) * 36, (Math.random() - 0.5) * 22, -4 - Math.random() * 14], i * 3)
      seed[i] = Math.random() * 10
    }
    return { pos, seed }
  }, [count])

  useFrame(({ clock }, dt) => {
    const p = ref.current.geometry.attributes.position
    const t = clock.elapsedTime
    for (let i = 0; i < count; i++) {
      let y = p.getY(i) + dt * (0.25 + (data.seed[i] % 1) * 0.35)
      if (y > 11) y = -11
      p.setY(i, y)
      p.setX(i, data.pos[i * 3] + Math.sin(t * 0.4 + data.seed[i]) * 0.6)
    }
    p.needsUpdate = true
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos.slice(), 3]} />
      </bufferGeometry>
      <pointsMaterial map={tex} size={size} transparent opacity={0.4} depthWrite={false} alphaTest={0.02} />
    </points>
  )
}

// Staff lines slide through the scene, with a note travelling along each stave.
function Staff({ y, z, speed, offset }) {
  const dot = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + offset
    dot.current.position.x = ((t % 1) - 0.5) * 44
  })
  return (
    <group position={[0, y, z]} rotation={[0, 0, 0.04]}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, i * 0.34, 0]}>
          <planeGeometry args={[60, 0.012]} />
          <meshBasicMaterial color="#caa76a" transparent opacity={0.22} />
        </mesh>
      ))}
      <mesh ref={dot} position={[0, 0.34 * 2, 0]}>
        <circleGeometry args={[0.16, 24]} />
        <meshBasicMaterial color="#ffd98a" transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

function Drift() {
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime
    const scroll = window.scrollY / Math.max(1, document.body.scrollHeight)
    camera.position.x = Math.sin(t * 0.1) * 0.8
    camera.position.y = Math.cos(t * 0.08) * 0.4 - scroll * 10
    camera.lookAt(0, camera.position.y * 0.6, 0)
  })
  return null
}

export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <Canvas camera={{ fov: 50, position: [0, 0, 9] }} dpr={[1, 1.5]} gl={{ alpha: true }}>
        <Drift />
        <Staff y={3} z={-6} speed={0.018} offset={0.1} />
        <Staff y={-2} z={-9} speed={0.012} offset={0.6} />
        <Staff y={-9} z={-7} speed={0.015} offset={0.35} />
        <FloatingNotes char="♪" count={36} size={1.1} />
        <FloatingNotes char="♫" count={22} size={1.5} />
        <Sparkles count={90} scale={[30, 20, 8]} size={3} speed={0.3} color="#caa76a" opacity={0.6} />
      </Canvas>
    </div>
  )
}
