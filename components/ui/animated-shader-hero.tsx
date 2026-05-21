'use client'
import React, { useRef, useEffect } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroProps {
  trustBadge?: {
    text: string
    icons?: string[]
  }
  headline: {
    line1: string
    line2: string
  }
  subtitle?: string
  buttons?: {
    primary?: { text: string; onClick?: () => void }
    secondary?: { text: string; onClick?: () => void }
  }
  className?: string
}

// ─── Shader source — colours adapted to portfolio palette ─────────────────────
// Original by Matthias Hurrle (@atzedent).
// Colour edits: warm-amber fog vec replaced with terracotta proportions
// (R dominant, G reduced), spectral phase vec shifted to favour reds/golds
// over blue, matching --terracotta-500 (#C8553D) and --gold-500 (#B89B5E).
const SHADER_SOURCE = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T  time
#define R  resolution
#define MN min(R.x,R.y)

float rnd(vec2 p){
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p){
  float t=.0,a=1.;mat2 m=mat2(1.,-.5,.2,1.2);
  for(int i=0;i<5;i++){t+=a*noise(p);p*=2.*m;a*=.5;}
  return t;
}
float clouds(vec2 p){
  float d=1.,t=.0;
  for(float i=.0;i<3.;i++){
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);d=a;p*=2./(i+1.);
  }
  return t;
}
void main(void){
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for(float i=1.;i<12.;i++){
    uv+=.1*cos(i*vec2(.1+.01*i,.8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    // Spectral phase vec shifted toward warmer reds/golds (was vec3(1,2,3))
    col+=.00125/d*(cos(sin(i)*vec3(0.9,1.7,2.4))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    // Fog colour: terracotta proportions #C8553D ≈ R:G:B = 3.3:1.4:1
    // (was vec3(bg*.25,bg*.137,bg*.05) — warm amber)
    col=mix(col,vec3(bg*.24,bg*.095,bg*.06),d);
  }
  O=vec4(col,1);
}`

// ─── WebGL renderer hook ───────────────────────────────────────────────────────

const useShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2')
    if (!gl) {
      console.warn('WebGL 2 not supported — shader hero disabled.')
      return
    }

    // ── compile helpers ──
    const compile = (type: number, src: string): WebGLShader | null => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(s))
        gl.deleteShader(s)
        return null
      }
      return s
    }

    const vertSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){ gl_Position = position; }`

    const vert = compile(gl.VERTEX_SHADER, vertSrc)
    const frag = compile(gl.FRAGMENT_SHADER, SHADER_SOURCE)
    if (!vert || !frag) return

    const prog = gl.createProgram()!
    gl.attachShader(prog, vert)
    gl.attachShader(prog, frag)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Shader link error:', gl.getProgramInfoLog(prog))
      return
    }

    const buf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW)

    const posLoc = gl.getAttribLocation(prog, 'position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const uRes  = gl.getUniformLocation(prog, 'resolution')
    const uTime = gl.getUniformLocation(prog, 'time')

    // ── resize ──
    const resize = () => {
      const dpr = Math.max(1, 0.5 * window.devicePixelRatio)
      canvas.width  = window.innerWidth  * dpr
      canvas.height = window.innerHeight * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    // ── render loop ──
    const loop = (now: number) => {
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(prog)
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, now * 1e-3)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      gl.deleteProgram(prog)
      gl.deleteShader(vert)
      gl.deleteShader(frag)
      gl.deleteBuffer(buf)
    }
  }, [])

  return canvasRef
}

// ─── Hero component ────────────────────────────────────────────────────────────

const Hero: React.FC<HeroProps> = ({
  trustBadge,
  headline,
  subtitle,
  buttons,
  className = '',
}) => {
  const canvasRef = useShaderBackground()

  return (
    <div
      className={`relative w-full h-screen overflow-hidden ${className}`}
      style={{ background: 'var(--forest-900)' }}
    >
      {/* Shader canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none"
        style={{ background: 'var(--forest-900)' }}
      />

      {/* Subtle vignette so text stays readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(19,29,18,0.72) 100%)',
        }}
      />

      {/* Content overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        {/* Trust badge */}
        {trustBadge && (
          <div className="mb-8 animate-fade-in-down">
            <div
              className="flex items-center gap-2 px-6 py-3 backdrop-blur-md rounded-full text-sm font-mono uppercase tracking-[0.18em]"
              style={{
                background: 'rgba(184,155,94,0.08)',   /* gold-500 tint */
                border: '1px solid rgba(212,187,125,0.25)', /* gold-300 */
                color: 'var(--gold-300)',
              }}
            >
              {trustBadge.icons?.map((icon, i) => (
                <span key={i} style={{ color: 'var(--gold-300)' }}>{icon}</span>
              ))}
              <span>{trustBadge.text}</span>
            </div>
          </div>
        )}

        {/* Headlines */}
        <div className="text-center space-y-3 max-w-5xl mx-auto px-6">
          <div className="space-y-1">
            {/* Line 1 — cream → gold gradient */}
            <h1
              className="font-display italic animate-fade-in-up animation-delay-200 bg-clip-text"
              style={{
                fontSize: 'clamp(48px, 8vw, 112px)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                backgroundImage:
                  'linear-gradient(135deg, var(--cream-50) 0%, var(--gold-300) 60%, var(--gold-500) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% 200%',
              }}
            >
              {headline.line1}
            </h1>

            {/* Line 2 — terracotta gradient */}
            <h1
              className="font-display italic animate-fade-in-up animation-delay-400 bg-clip-text"
              style={{
                fontSize: 'clamp(48px, 8vw, 112px)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                backgroundImage:
                  'linear-gradient(135deg, var(--terracotta-400) 0%, var(--terracotta-500) 50%, var(--terracotta-600) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% 200%',
              }}
            >
              {headline.line2}
            </h1>
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div className="max-w-2xl mx-auto animate-fade-in-up animation-delay-600">
              <p
                className="font-sans font-light leading-relaxed"
                style={{
                  fontSize: 'clamp(16px, 1.5vw, 20px)',
                  color: 'var(--cream-300)',
                  letterSpacing: '-0.01em',
                }}
              >
                {subtitle}
              </p>
            </div>
          )}

          {/* CTA buttons */}
          {buttons && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fade-in-up animation-delay-800">
              {buttons.primary && (
                <button
                  onClick={buttons.primary.onClick}
                  data-cursor="hover"
                  className="px-8 py-4 rounded-full font-sans font-medium text-base transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'var(--terracotta-500)',
                    color: 'var(--cream-50)',
                    letterSpacing: '-0.01em',
                    boxShadow: '0 8px 32px rgba(200,85,61,0.30)',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background = 'var(--terracotta-400)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background = 'var(--terracotta-500)'
                  }}
                >
                  {buttons.primary.text}
                </button>
              )}
              {buttons.secondary && (
                <button
                  onClick={buttons.secondary.onClick}
                  data-cursor="hover"
                  className="px-8 py-4 rounded-full font-sans font-medium text-base transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  style={{
                    background: 'rgba(249,246,238,0.07)',
                    border: '1px solid rgba(217,205,181,0.25)',
                    color: 'var(--cream-200)',
                    letterSpacing: '-0.01em',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background =
                      'rgba(249,246,238,0.12)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background =
                      'rgba(249,246,238,0.07)'
                  }}
                >
                  {buttons.secondary.text}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Hero
