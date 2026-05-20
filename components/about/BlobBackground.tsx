'use client'
import { useEffect, useRef } from 'react'
import { getPrefersReducedMotion } from '@/lib/motion'

const VERT = `
  attribute vec2 a_position;
  varying vec2 vUv;
  void main() {
    vUv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform vec3 uBlobColor1;
  uniform vec3 uBlobColor2;
  uniform vec3 uBgColor;

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = uv;
    p.x *= aspect;

    vec2 c1 = vec2(0.3 + sin(uTime * 0.18) * 0.12, 0.4 + cos(uTime * 0.22) * 0.15);
    vec2 c2 = vec2(0.7 + cos(uTime * 0.14) * 0.10, 0.6 + sin(uTime * 0.20) * 0.12);
    c1 += (uMouse - 0.5) * 0.06;
    c2 -= (uMouse - 0.5) * 0.04;
    c1.x *= aspect;
    c2.x *= aspect;

    float r1 = 0.45;
    float r2 = 0.40;
    float blob1 = smoothstep(r1, 0.0, distance(p, c1));
    float blob2 = smoothstep(r2, 0.0, distance(p, c2));

    vec3 color = uBgColor;
    vec3 b1Soft = mix(uBlobColor1, uBgColor, 0.4);
    vec3 b2Soft = mix(uBlobColor2, uBgColor, 0.4);
    color = mix(color, b1Soft, blob1 * 0.55);
    color = mix(color, b2Soft, blob2 * 0.45);

    float grain = fract(sin(dot(uv * uTime, vec2(12.9, 78.2))) * 43758.5) - 0.5;
    color += grain * 0.025;

    gl_FragColor = vec4(color, 1.0);
  }
`

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  return shader
}

export default function BlobBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (getPrefersReducedMotion()) return

    const gl = canvas.getContext('webgl')
    if (!gl) return

    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT)
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG)
    const program = gl.createProgram()!
    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    gl.useProgram(program)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

    const posLoc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const uTime       = gl.getUniformLocation(program, 'uTime')
    const uMouse      = gl.getUniformLocation(program, 'uMouse')
    const uResolution = gl.getUniformLocation(program, 'uResolution')
    const uBlob1      = gl.getUniformLocation(program, 'uBlobColor1')
    const uBlob2      = gl.getUniformLocation(program, 'uBlobColor2')
    const uBg         = gl.getUniformLocation(program, 'uBgColor')

    gl.uniform3f(uBlob1, 0.784, 0.333, 0.239) // terracotta-500
    gl.uniform3f(uBlob2, 0.722, 0.608, 0.369) // gold-500
    gl.uniform3f(uBg,    0.961, 0.937, 0.902) // cream-100

    let time = 0
    let lastTs = 0
    let rafId = 0
    let isVisible = true
    const mouse  = { x: 0.5, y: 0.5 }
    const target = { x: 0.5, y: 0.5 }

    // Pause GPU work when section is scrolled out of view
    const io = new IntersectionObserver(
      ([e]) => { isVisible = e.isIntersecting },
      { rootMargin: '80px' }
    )
    io.observe(canvas)

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width  = parent.offsetWidth
      canvas.height = parent.offsetHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uResolution, canvas.width, canvas.height)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement!)
    resize()

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      target.x =        (e.clientX - rect.left) / rect.width
      target.y = 1.0 - (e.clientY - rect.top)  / rect.height
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    const render = (ts: number) => {
      rafId = requestAnimationFrame(render)
      if (!isVisible) return           // skip draw; keep RAF alive for instant resume

      const dt = lastTs ? ts - lastTs : 16
      lastTs = ts
      time  += dt * 0.001

      mouse.x += (target.x - mouse.x) * 0.05
      mouse.y += (target.y - mouse.y) * 0.05

      gl.uniform1f(uTime,  time)
      gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    rafId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('mousemove', onMouse)
      gl.deleteProgram(program)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        background: 'linear-gradient(180deg, var(--cream-100) 0%, var(--cream-200) 100%)',
      }}
    />
  )
}
