'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import type { Milestone } from './data/milestones'

type Props = {
  milestone: Milestone
  index: number
}

function buildGeometry(shape: Milestone['shape']): THREE.BufferGeometry {
  switch (shape) {
    case 'icosahedron':  return new THREE.IcosahedronGeometry(1.1, 1)
    case 'torus':        return new THREE.TorusGeometry(0.8, 0.32, 10, 32)
    case 'octahedron':   return new THREE.OctahedronGeometry(1.0, 0)
    case 'cylinder':     return new THREE.CylinderGeometry(0.6, 0.6, 1.6, 16)
    case 'dodecahedron': return new THREE.DodecahedronGeometry(1.0, 0)
  }
}

export default function Marker({ milestone, index }: Props) {
  const groupRef   = useRef<THREE.Group>(null)
  const { camera } = useThree()

  const markerPos = useMemo(
    () => new THREE.Vector3(index * 8, 0, 0),
    [index]
  )

  const { baseGeom, edgeGeom, lineCol, dotCol } = useMemo(() => {
    const baseGeom = buildGeometry(milestone.shape)
    const edgeGeom = new THREE.EdgesGeometry(baseGeom)
    const lineCol  = new THREE.Color(milestone.color)
    // dots are slightly lighter than the edge lines — mirrors the globe's dot/line relationship
    const dotCol   = new THREE.Color(milestone.color).lerp(new THREE.Color('#F5EFE6'), 0.25)
    return { baseGeom, edgeGeom, lineCol, dotCol }
  }, [milestone.shape, milestone.color])

  // Dispose geometries on unmount to avoid GPU memory leak
  useEffect(() => {
    return () => {
      baseGeom.dispose()
      edgeGeom.dispose()
    }
  }, [baseGeom, edgeGeom])

  useFrame(() => {
    const group = groupRef.current
    if (!group) return

    // Scale 0→1 as camera closes within 8→4 units, 1→0 as it passes
    const distance = camera.position.distanceTo(markerPos)
    const visible  = THREE.MathUtils.smoothstep(8, 4, distance)
    group.scale.setScalar(visible)

    // Slow idle rotation — same cadence as the globe's auto-rotate
    group.rotation.y += 0.004
  })

  return (
    <Float speed={1.2} floatIntensity={0.3} rotationIntensity={0}>
      <group ref={groupRef} position={markerPos} scale={0}>

        {/* Wireframe edges — matches the globe's lat/lon line aesthetic */}
        <lineSegments geometry={edgeGeom}>
          <lineBasicMaterial color={lineCol} transparent opacity={0.82} />
        </lineSegments>

        {/* Vertex dots — matches the globe's land-dot aesthetic */}
        <points geometry={baseGeom}>
          <pointsMaterial
            color={dotCol}
            size={0.055}
            sizeAttenuation
            transparent
            opacity={0.88}
          />
        </points>

      </group>
    </Float>
  )
}
