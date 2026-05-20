'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 280

function Particles() {
  const pointsRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 28
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    return arr
  }, [])

  useFrame(() => {
    const p = pointsRef.current
    if (!p) return
    p.rotation.y += 0.0005
    p.rotation.x += 0.0002
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#B89B5E"
        size={0.055}
        transparent
        opacity={0.32}
        sizeAttenuation
      />
    </points>
  )
}

export default function ProjectsScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 55 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: false }}
    >
      <Particles />
    </Canvas>
  )
}
