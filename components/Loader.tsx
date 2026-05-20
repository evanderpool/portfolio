'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { getPrefersReducedMotion } from '@/lib/motion'

export default function Loader() {
  const loaderRef  = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLSpanElement>(null)
  const barRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loader = loaderRef.current
    if (!loader) return

    if (sessionStorage.getItem('ev-loaded')) {
      loader.style.display = 'none'
      return
    }

    const run = async () => {
      await document.fonts.ready

      if (getPrefersReducedMotion()) {
        sessionStorage.setItem('ev-loaded', '1')
        loader.style.display = 'none'
        return
      }

      const tl = gsap.timeline()
      tl.to(barRef.current, { width: '100%', duration: 1.4, ease: 'power2.inOut' })
        .to(wordmarkRef.current, { scale: 1.06, duration: 0.3, ease: 'power2.out' }, '-=0.1')
        .to(loader, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '+=0.15')
        .call(() => {
          sessionStorage.setItem('ev-loaded', '1')
          if (loaderRef.current) loaderRef.current.style.display = 'none'
        })
    }

    run()
  }, [])

  return (
    <div
      ref={loaderRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'var(--cream-50)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <span
        ref={wordmarkRef}
        className="font-display italic"
        style={{
          fontSize: 'clamp(24px, 5vw, 52px)',
          color: 'var(--terracotta-500)',
          letterSpacing: '-0.02em',
        }}
      >
        Erick Vanderpool
      </span>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '3px',
          background: 'var(--cream-300)',
        }}
      >
        <div
          ref={barRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '3px',
            width: '0%',
            background: 'var(--terracotta-500)',
          }}
        />
      </div>
    </div>
  )
}
