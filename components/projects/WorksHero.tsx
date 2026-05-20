'use client'
/**
 * WorksHero — atmospheric shader banner at the top of the /work page.
 *
 * Uses the animated-shader-hero canvas with the portfolio colour palette
 * (terracotta + gold + forest) applied to the GLSL nebula.
 *
 * Height is intentionally shorter than full-screen (60 vh) so the
 * projects grid is immediately visible on load.
 */
import dynamic from 'next/dynamic'

// Load the shader component client-side only (WebGL 2 required)
const ShaderHero = dynamic(
  () => import('@/components/ui/animated-shader-hero'),
  { ssr: false }
)

export default function WorksHero() {
  return (
    <div style={{ height: '60vh', minHeight: '400px', position: 'relative' }}>
      <ShaderHero
        trustBadge={{ text: 'Elements of the Work', icons: ['✦'] }}
        headline={{
          line1: 'Crafted With',
          line2: 'Intent',
        }}
        subtitle="Engineering, content, and data systems — built end-to-end."
        className="!h-full"
      />

      {/* Seamless blend into the cream-100 projects section below */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background:
            'linear-gradient(to bottom, transparent 0%, var(--cream-100) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
