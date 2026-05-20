'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getPrefersReducedMotion } from '@/lib/motion'
import { TransitionLink } from '@/components/transitions/TransitionLink'

gsap.registerPlugin(ScrollTrigger)

const LINES = ["Let's build", 'something']

export default function ContactCTA() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const subRef      = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || getPrefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const lines = headlineRef.current!.querySelectorAll('.cta-line')
      gsap.fromTo(
        lines,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 75%' },
        }
      )
      gsap.fromTo(
        subRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact"
      style={{
        background: 'var(--cream-100)',
        padding: 'clamp(80px, 12vw, 160px) clamp(24px, 6vw, 80px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {/* Section label */}
      <div
        className="font-mono uppercase tracking-[0.2em]"
        style={{
          position: 'absolute',
          top: 'clamp(24px, 4vw, 40px)',
          left: 'clamp(24px, 6vw, 80px)',
          fontSize: '11px',
          color: 'var(--gold-500)',
        }}
      >
        05 / Contact
      </div>

      {/* Headline */}
      <div ref={headlineRef}>
        {LINES.map((line) => (
          <div key={line} style={{ overflow: 'hidden' }}>
            <div
              className="cta-line font-display font-black"
              style={{
                fontSize: 'clamp(54px, 9vw, 108px)',
                letterSpacing: '-0.03em',
                color: 'var(--forest-900)',
                lineHeight: 0.9,
              }}
            >
              {line}
            </div>
          </div>
        ))}
        {/* Arrow line in terracotta */}
        <div style={{ overflow: 'hidden' }}>
          <div
            className="cta-line font-display font-black"
            style={{
              fontSize: 'clamp(54px, 9vw, 108px)',
              letterSpacing: '-0.03em',
              lineHeight: 0.9,
              color: 'var(--terracotta-500)',
            }}
          >
            worth building. →
          </div>
        </div>
      </div>

      {/* Sub-content */}
      <div
        ref={subRef}
        style={{
          marginTop: '3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <p
          className="font-sans"
          style={{
            fontSize: '16px',
            color: 'var(--forest-400)',
            letterSpacing: '-0.01em',
            lineHeight: 1.6,
          }}
        >
          Open to freelance, full-time, and collaborations.
        </p>

        <TransitionLink href="/contact" data-cursor="hover" className="shiny-cta">
          <span>Get in touch</span>
        </TransitionLink>
      </div>
    </section>
  )
}
