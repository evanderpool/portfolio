'use client'
import { useEffect, useRef, Suspense } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'

const GlassMark = dynamic(() => import('./GlassMark'), { ssr: false })

function Avatar() {
  return (
    <svg
      viewBox="0 0 300 420"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      {/* Dark body mass rising from bottom */}
      <ellipse cx="150" cy="460" rx="160" ry="155" fill="#0D1409" />

      {/* Head — cream circle */}
      <circle cx="150" cy="190" r="100" fill="#F5EFE6" />

      {/* Left eye */}
      <circle cx="115" cy="182" r="17" fill="#131D12" />

      {/* Right eye — slightly larger for character */}
      <circle cx="187" cy="182" r="20" fill="#131D12" />

      {/* Smile */}
      <path
        d="M 116 215 Q 151 248 186 215"
        stroke="#131D12"
        strokeWidth="5.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function PortraitFrame() {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const el = cardRef.current
    if (!el) return

    const xTo = gsap.quickTo(el, 'rotateY', { duration: 0.7, ease: 'power2.out' })
    const yTo = gsap.quickTo(el, 'rotateX', { duration: 0.7, ease: 'power2.out' })

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left  - rect.width  / 2) / rect.width
      const y = (e.clientY - rect.top   - rect.height / 2) / rect.height
      xTo(x *  5)
      yTo(y * -5)
    }
    const onLeave = () => { xTo(0); yTo(0) }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      data-cursor="hover"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}
    >
      {/* Card wrapper — provides the tilt + relative anchor for GlassMark */}
      <div
        ref={cardRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '380px',
          perspective: '800px',
        }}
      >
        {/* Outer card — cream frame + shadow */}
        <div
          style={{
            background: 'var(--cream-50)',
            borderRadius: '20px',
            padding: '6px',
            boxShadow:
              '0 24px 64px rgba(19, 29, 18, 0.14), 0 6px 20px rgba(19, 29, 18, 0.08)',
          }}
        >
          {/* Inner dark portrait area */}
          <div
            style={{
              background: 'var(--forest-900)',
              borderRadius: '15px',
              aspectRatio: '3 / 4',
              overflow: 'hidden',
            }}
          >
            <Avatar />
          </div>
        </div>

        {/* Glass EV mark — overlaps top-right of the card */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-14px',
            right: '-14px',
            width: '112px',
            height: '112px',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <Suspense fallback={null}>
            <GlassMark />
          </Suspense>
        </div>
      </div>

      {/* Caption */}
      <p
        className="font-sans"
        style={{
          fontSize: '13px',
          color: 'var(--forest-400)',
          letterSpacing: '0.02em',
          textAlign: 'center',
        }}
      >
        Full-stack engineer · Data systems · AI automation
      </p>
    </div>
  )
}
