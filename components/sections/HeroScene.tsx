'use client'
import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function IcosahedronMesh() {
  const meshRef  = useRef<THREE.Mesh>(null)
  const mouse    = useRef({ x: 0, y: 0 })
  const targetRX = useRef(0)

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth)  * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return
    mesh.rotation.y += 0.003
    mesh.position.y  = Math.sin(state.clock.elapsedTime * 0.4) * 0.18

    targetRX.current = mouse.current.y * 0.14
    mesh.rotation.x += (targetRX.current - mesh.rotation.x) * 0.04
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.6, 1]} />
      <meshStandardMaterial
        color="#B89B5E"
        flatShading
        roughness={0.6}
        metalness={0.2}
      />
    </mesh>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.5} color="#F5EFE6" />
      <directionalLight position={[4, 6, 4]}  intensity={1.4} color="#EDE4D3" />
      <pointLight       position={[-4, -2, 2]} intensity={0.6} color="#C8553D" />
      <IcosahedronMesh />
    </Canvas>
  )
}
