'use client'
import { Canvas } from '@react-three/fiber'
import { Text3D, MeshTransmissionMaterial, Float, Environment } from '@react-three/drei'
import { Suspense } from 'react'

function Initials() {
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
      <Text3D
        font="/fonts/fraunces.json"
        size={0.72}
        height={0.28}
        bevelEnabled
        bevelSize={0.018}
        bevelThickness={0.035}
        letterSpacing={-0.04}
        position={[-0.62, -0.36, 0]}
      >
        EV
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.5}
          roughness={0.05}
          ior={1.5}
          chromaticAberration={0.06}
          anisotropy={0.3}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.1}
          color="#F5EFE6"
        />
      </Text3D>
    </Float>
  )
}

export default function GlassMark() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 35 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 2]} intensity={1.2} />
      <Suspense fallback={null}>
        <Initials />
        <Environment preset="warehouse" background={false} />
      </Suspense>
    </Canvas>
  )
}
