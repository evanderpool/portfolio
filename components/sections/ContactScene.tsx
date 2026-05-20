'use client'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function WireframeSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.04
    mesh.scale.setScalar(pulse)
    mesh.rotation.y += 0.0012
    mesh.rotation.x += 0.0006
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[3.2, 3]} />
      <meshBasicMaterial
        color="#D4BB7D"
        wireframe
        transparent
        opacity={0.16}
      />
    </mesh>
  )
}

export default function ContactScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 58 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      <WireframeSphere />
    </Canvas>
  )
}
