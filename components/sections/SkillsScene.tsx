'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const NODES = [
  { name: 'PostgreSQL', color: '#B89B5E', radius: 1.9, speed: 0.45, inc: 0.25  },
  { name: 'Redis',      color: '#B89B5E', radius: 2.4, speed: 0.35, inc: 0.55  },
  { name: 'Next.js',   color: '#2D3D2C', radius: 1.5, speed: 0.65, inc: -0.3  },
  { name: 'TypeScript', color: '#2D3D2C', radius: 2.6, speed: 0.3,  inc: 0.7   },
  { name: 'React',      color: '#2D3D2C', radius: 1.8, speed: 0.5,  inc: -0.55 },
  { name: 'Node.js',   color: '#C8553D', radius: 2.1, speed: 0.42, inc: 0.4   },
  { name: 'Prisma',    color: '#C8553D', radius: 2.8, speed: 0.28, inc: -0.2  },
  { name: 'GSAP',      color: '#4A5D49', radius: 2.3, speed: 0.55, inc: 0.8   },
  { name: 'Git',       color: '#4A5D49', radius: 1.65, speed: 0.6, inc: -0.45 },
]

function OrbitalNode({
  node,
  index,
}: {
  node: (typeof NODES)[0]
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const phase   = useMemo(() => (index / NODES.length) * Math.PI * 2, [index])

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t     = state.clock.elapsedTime
    const angle = t * node.speed + phase
    mesh.position.x = Math.cos(angle) * node.radius
    mesh.position.z = Math.sin(angle) * node.radius * Math.cos(node.inc)
    mesh.position.y = Math.sin(angle) * node.radius * Math.sin(node.inc)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.1, 14, 14]} />
      <meshStandardMaterial color={node.color} roughness={0.4} metalness={0.3} />
    </mesh>
  )
}

function CentralCore() {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return
    mesh.rotation.y = state.clock.elapsedTime * 0.3
    mesh.rotation.x = state.clock.elapsedTime * 0.15
  })
  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[0.38, 0]} />
      <meshStandardMaterial color="#C8553D" flatShading roughness={0.5} metalness={0.3} emissive="#7A2E20" emissiveIntensity={0.3} />
    </mesh>
  )
}

export default function SkillsScene() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 7], fov: 48 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.5} color="#EDE4D3" />
      <pointLight position={[0, 0, 0]} intensity={1.2} color="#C8553D" distance={6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#D4BB7D" />
      <CentralCore />
      {NODES.map((node, i) => (
        <OrbitalNode key={node.name} node={node} index={i} />
      ))}
    </Canvas>
  )
}
