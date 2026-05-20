'use client'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { milestones } from './data/milestones'
import { useProgress } from './TimelineCanvas'

// Pre-build curve points: start → milestones → end
// Z offset keeps camera in front of the marker plane
const curvePoints = [
  new THREE.Vector3(-6, 0.5, 8),
  ...milestones.map((m, i) => new THREE.Vector3(i * 8, m.cameraOffset[1], m.cameraOffset[2] + 2)),
  new THREE.Vector3((milestones.length - 1) * 8 + 6, 0.5, 2),
]
const curve = new THREE.CatmullRomCurve3(curvePoints, false, 'centripetal', 0.5)

// Pre-build fog colors once — avoids allocation in useFrame
const fogColors = milestones.map((m) => new THREE.Color(m.fogColor))

// Module-level scratch objects — mutated per frame, never reallocated (prevents GC pressure)
const _pos     = new THREE.Vector3()
const _lookAt  = new THREE.Vector3()
const _fogColor = new THREE.Color()

export default function SplineCamera() {
  const progressRef        = useProgress()
  const { camera, scene, gl } = useThree()

  useFrame(() => {
    const t = progressRef.current.value

    // Camera tracks the scrub value directly — GSAP scrub:1 already provides easing.
    // A second lerp layer caused snap/jump when scroll direction reversed.
    curve.getPointAt(t, _pos)
    camera.position.copy(_pos)

    // Look slightly ahead on the curve
    const lookT = Math.min(t + 0.04, 1)
    curve.getPointAt(lookT, _lookAt)
    camera.lookAt(_lookAt)

    // Interpolate fog color between adjacent milestones
    const raw    = t * (milestones.length - 1)
    const idx    = Math.floor(raw)
    const next   = Math.min(idx + 1, milestones.length - 1)
    const localT = raw - idx

    _fogColor.copy(fogColors[idx]).lerp(fogColors[next], localT)

    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(_fogColor)
    }
    gl.setClearColor(_fogColor, 1)
  })

  return null
}
