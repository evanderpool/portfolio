'use client'
import { Suspense } from 'react'
import { milestones } from './data/milestones'
import Marker from './Marker'
import SplineCamera from './SplineCamera'

export default function TimelineScene() {
  return (
    <>
      <ambientLight intensity={0.4} color="#F5EFE6" />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow={false} />
      <directionalLight position={[-5, 3, -2]} intensity={0.5} color="#C8553D" />
      <fog attach="fog" args={['#131D12', 6, 28]} />

      <Suspense fallback={null}>
        {milestones.map((m, i) => (
          <Marker key={m.year} milestone={m} index={i} />
        ))}
      </Suspense>

      <SplineCamera />
    </>
  )
}
