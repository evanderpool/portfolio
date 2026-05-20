'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getPrefersReducedMotion } from '@/lib/motion'
import BlobBackground from './BlobBackground'
import AboutText     from './AboutText'
import SkillsList    from './SkillsList'
import PortraitFrame from './PortraitFrame'

gsap.registerPlugin(ScrollTrigger)

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const right   = rightRef.current
    if (!section || !right) return

    if (getPrefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        right,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 72%' },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{ position: 'relative' }}
    >
      <BlobBackground />

      {/* Top rule */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'var(--terracotta-500)',
          opacity: 0.35,
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: 'clamp(80px, 12vw, 160px) clamp(24px, 6vw, 80px)',
        }}
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16"
          style={{ alignItems: 'start' }}
        >
          {/* Left — bio + skills. CSS sticky keeps it in view while right scrolls */}
          <div
            className="lg:sticky lg:top-[80px] lg:self-start"
            style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
          >
            <AboutText />
            <SkillsList />
          </div>

          {/* Right — portrait */}
          <div
            ref={rightRef}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              paddingTop: 'clamp(0px, 4vw, 64px)',
            }}
          >
            <PortraitFrame />
          </div>
        </div>
      </div>
    </section>
  )
}
