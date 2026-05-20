'use client'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ORB_COUNT = 4

function Sculpture() {
  const groupRef = useRef<THREE.Group>(null)
  const orbRefs  = useRef<(THREE.Mesh | null)[]>([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const g = groupRef.current
    if (!g) return

    g.rotation.y  = t * 0.25
    g.rotation.x  = Math.sin(t * 0.3) * 0.08

    orbRefs.current.forEach((orb, i) => {
      if (!orb) return
      const phase  = (i / ORB_COUNT) * Math.PI * 2
      const radius = 1.6 + i * 0.25
      const speed  = 0.45 + i * 0.12
      orb.position.x = Math.cos(t * speed + phase) * radius
      orb.position.z = Math.sin(t * speed + phase) * radius * 0.6
      orb.position.y = Math.sin(t * 0.7 + phase)  * 0.4
    })
  })

  return (
    <group ref={groupRef}>
      {/* Central torus knot */}
      <mesh>
        <torusKnotGeometry args={[0.9, 0.28, 120, 14]} />
        <meshStandardMaterial
          color="#2D3D2C"
          wireframe
          opacity={0.85}
          transparent
        />
      </mesh>
      {/* Inner solid */}
      <mesh scale={0.55}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial color="#4A5D49" flatShading roughness={0.8} />
      </mesh>
      {/* Orbiting gold spheres */}
      {Array.from({ length: ORB_COUNT }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { orbRefs.current[i] = el }}
        >
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color="#B89B5E" roughness={0.3} metalness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

export default function AboutScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 44 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.4} color="#EDE4D3" />
      <directionalLight position={[3, 5, 3]}  intensity={1.2} color="#D4BB7D" />
      <pointLight       position={[-3, -3, 2]} intensity={0.5} color="#2D3D2C" />
      <Sculpture />
    </Canvas>
  )
}
