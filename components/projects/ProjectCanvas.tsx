'use client'
import { Canvas } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import { DistortionPlane } from './DistortionPlane'

export default function ProjectCanvas() {
  return (
    <Canvas
      frameloop="demand"
      gl={{ alpha: true, antialias: false }}
      dpr={[1, 1.5]}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      <OrthographicCamera
        makeDefault
        position={[0, 0, 1]}
        left={-1}
        right={1}
        top={1}
        bottom={-1}
        near={-10}
        far={10}
      />
      <DistortionPlane />
    </Canvas>
  )
}
