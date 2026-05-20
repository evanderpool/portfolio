'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useHover } from './context/HoverContext'

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uDistortion;
  uniform vec2 uMouse;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float dist = distance(uv, uMouse);
    float wave = sin(dist * 12.0 - uTime * 2.5) * 0.08;
    pos.z += wave * uDistortion * smoothstep(0.6, 0.0, dist);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const FRAG = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 offset = vec2(sin(uTime * 0.3) * 0.004, 0.0);
    float r = texture2D(uTexture, vUv + offset).r;
    float g = texture2D(uTexture, vUv).g;
    float b = texture2D(uTexture, vUv - offset).b;
    vec3 color = vec3(r, g, b);
    float grain = (fract(sin(dot(vUv * uTime, vec2(12.9, 78.2))) * 43758.5) - 0.5) * 0.05;
    color += grain;
    gl_FragColor = vec4(color, uOpacity);
  }
`

function makeFallbackTexture() {
  const data = new Uint8Array([200, 183, 162, 255])
  const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat)
  tex.needsUpdate = true
  return tex
}

const textureCache = new Map<string, THREE.Texture>()

function getOrLoadTexture(url: string): THREE.Texture {
  if (textureCache.has(url)) return textureCache.get(url)!
  const tex = new THREE.TextureLoader().load(url)
  textureCache.set(url, tex)
  return tex
}

export function DistortionPlane() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { hovered } = useHover()
  const { size, invalidate } = useThree()

  const fallback = useMemo(makeFallbackTexture, [])

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uDistortion: { value: 0 },
          uOpacity: { value: 0 },
          uTexture: { value: fallback },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
      }),
    [fallback],
  )

  const opacityRef = useRef(0)
  const distortRef = useRef(0)

  // Kick off the first frame whenever hover state changes
  useEffect(() => { invalidate() }, [hovered, invalidate])

  useFrame((state) => {
    if (!meshRef.current) return
    mat.uniforms.uTime.value = state.clock.elapsedTime

    const opTarget = hovered ? 1 : 0
    opacityRef.current += (opTarget - opacityRef.current) * 0.08
    mat.uniforms.uOpacity.value = opacityRef.current

    const distTarget = hovered ? 0.3 : 0
    distortRef.current += (distTarget - distortRef.current) * 0.05
    mat.uniforms.uDistortion.value = distortRef.current

    if (hovered) {
      const tex = getOrLoadTexture(hovered.cover)
      if (mat.uniforms.uTexture.value !== tex) {
        mat.uniforms.uTexture.value = tex
      }

      const { rect } = hovered
      const ndcX = (rect.left + rect.width / 2) / size.width * 2 - 1
      const ndcY = 1 - (rect.top + rect.height / 2) / size.height * 2

      meshRef.current.position.x += (ndcX - meshRef.current.position.x) * 0.15
      meshRef.current.position.y += (ndcY - meshRef.current.position.y) * 0.15

      const scaleX = (rect.width / size.width) * 2
      const scaleY = (rect.height / size.height) * 2
      meshRef.current.scale.x += (scaleX - meshRef.current.scale.x) * 0.15
      meshRef.current.scale.y += (scaleY - meshRef.current.scale.y) * 0.15
    }

    // Keep requesting frames while opacity or distortion are still transitioning
    if (
      Math.abs(opacityRef.current - opTarget)   > 0.001 ||
      Math.abs(distortRef.current - distTarget) > 0.001 ||
      hovered !== null
    ) {
      state.invalidate()
    }
  })

  return (
    <mesh ref={meshRef} material={mat}>
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  )
}
