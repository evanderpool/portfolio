'use client'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getPrefersReducedMotion } from '@/lib/motion'
import { milestones } from './data/milestones'
import MobileTimeline from './MobileTimeline'

gsap.registerPlugin(ScrollTrigger)

const TimelineCanvas = dynamic(() => import('./TimelineCanvas'), { ssr: false })

export default function TimelineSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const progressRef = useRef({ value: 0 })
  const [isMobile,  setIsMobile]  = useState(false)
  const [canvasActive, setCanvasActive] = useState(false)

  // Mobile detection — matches (pointer: coarse) pattern used in ProjectsSection
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Activate canvas only when section is near the viewport
  useEffect(() => {
    const section = sectionRef.current
    if (!section || isMobile) return
    const io = new IntersectionObserver(
      ([e]) => setCanvasActive(e.isIntersecting),
      { rootMargin: '200px' }
    )
    io.observe(section)
    return () => io.disconnect()
  }, [isMobile])

  useEffect(() => {
    const section = sectionRef.current
    if (!section || isMobile) return

    // Reset progress on each setup so invalidateOnRefresh works correctly
    progressRef.current.value = 0

    const ctx = gsap.context(() => {
      const totalLength = (milestones.length + 1) * window.innerWidth

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${totalLength}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // The single scrub tween: GSAP mutates progressRef.current.value each frame.
      // R3F's useFrame and the HTML RAF loops read this value directly — no React state.
      if (!getPrefersReducedMotion()) {
        tl.to(progressRef.current, { value: 1, ease: 'none', duration: 1 })
      } else {
        // Reduced motion: skip the cinematic pan, show first milestone only
        progressRef.current.value = 0
      }
    }, section)

    return () => ctx.revert()
  }, [isMobile])

  // Journey section is desktop-only: the cinematic 3D spline camera doesn't
  // translate to mobile. Hide entirely rather than show a broken fallback.
  if (isMobile) {
    return null
  }

  return (
    <section
      ref={sectionRef}
      id="timeline"
      style={{ background: 'var(--forest-900)', position: 'relative' }}
      aria-label="Career timeline"
    >
      {/* Section label */}
      <div
        className="font-mono uppercase"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 10,
          fontSize: '11px',
          letterSpacing: '0.18em',
          color: 'var(--gold-500)',
          padding: 'clamp(24px, 4vw, 40px) clamp(24px, 6vw, 80px)',
          pointerEvents: 'none',
        }}
        aria-hidden
      >
        03.5 / Journey
      </div>

      {/* Viewport-height stage — becomes the pinned frame */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100dvh',
          overflow: 'hidden',
        }}
      >
        <TimelineCanvas progressRef={progressRef} active={canvasActive} />
      </div>
    </section>
  )
}
