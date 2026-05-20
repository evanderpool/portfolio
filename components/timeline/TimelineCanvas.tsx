'use client'
import { createContext, useContext, Suspense, type MutableRefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import TimelineScene from './TimelineScene'
import MilestoneCaption from './MilestoneCaption'
import YearGhost from './YearGhost'
import { milestones } from './data/milestones'

export type ProgressRef = MutableRefObject<{ value: number }>

export const ProgressContext = createContext<ProgressRef>({ current: { value: 0 } } as ProgressRef)
export const useProgress = () => useContext(ProgressContext)

type Props = {
  progressRef: ProgressRef
  active?: boolean
}

export default function TimelineCanvas({ progressRef, active = true }: Props) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        frameloop={active ? 'always' : 'demand'}
        camera={{ position: [0, 1.5, 8], fov: 52 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Suspense fallback={null}>
          <ProgressContext.Provider value={progressRef}>
            <TimelineScene />
          </ProgressContext.Provider>
        </Suspense>
      </Canvas>

      <div
        aria-live="polite"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <YearGhost progressRef={progressRef} />
        {milestones.map((m, i) => (
          <MilestoneCaption
            key={m.year}
            milestone={m}
            index={i}
            total={milestones.length}
            progressRef={progressRef}
          />
        ))}
      </div>
    </div>
  )
}
