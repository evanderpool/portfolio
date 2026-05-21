'use client'
import { useEffect, useRef, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { getPrefersReducedMotion } from '@/lib/motion'

const WireframeDottedGlobe = dynamic(() => import('@/components/ui/wireframe-dotted-globe'), { ssr: false })
const ShaderBackground     = dynamic(() => import('@/components/ui/shader-background'), { ssr: false })

const HEADLINE_LINES = ['Full-Stack', 'Engineer &', 'Content', 'Creator.']

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const linesRef   = useRef<HTMLDivElement>(null)
  const metaRef    = useRef<HTMLDivElement>(null)
  const ctaRef     = useRef<HTMLDivElement>(null)
  const scrollRef  = useRef<HTMLDivElement>(null)

  const [isMobile, setIsMobile] = useState(false)
  const [inView,   setInView]   = useState(false)

  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 639px)').matches)
  }, [])

  // IntersectionObserver gate: mount R3F canvas only when section is near viewport
  useEffect(() => {
    const section = sectionRef.current
    if (!section || isMobile) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { rootMargin: '200px' }
    )
    io.observe(section)
    return () => io.disconnect()
  }, [isMobile])

  useEffect(() => {
    if (getPrefersReducedMotion()) return
    if (!linesRef.current) return   // guard: refs not ready (strict-mode remount edge case)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        linesRef.current!.querySelectorAll('.hl'),
        { y: 90, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.08 },
        0.2
      )
        .fromTo(
          metaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          0.9
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          1.1
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          1.6
        )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100dvh', background: 'var(--forest-900)' }}
    >
      {/* Shader background — full section, always rendered */}
      <Suspense fallback={null}>
        <ShaderBackground className="absolute inset-0 w-full h-full" />
      </Suspense>

      {/* Dotted globe — right side, desktop only, gated by IntersectionObserver */}
      {!isMobile && inView && (
        <div
          className="absolute inset-y-0 right-0 w-full sm:w-[55%]"
          aria-hidden
        >
          <Suspense fallback={null}>
            <WireframeDottedGlobe />
          </Suspense>
        </div>
      )}

      {/* Diagonal rule */}
      <div
        className="absolute left-0 top-0 w-full h-full pointer-events-none overflow-hidden"
        aria-hidden
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '-5%',
            width: '60%',
            height: '1px',
            background: 'var(--terracotta-500)',
            transform: 'rotate(12deg)',
            opacity: 0.4,
            transformOrigin: 'left center',
          }}
        />
      </div>

      {/* Content */}
      <div
        className="relative z-10 flex flex-col justify-between"
        style={{ minHeight: '100dvh', padding: 'clamp(32px, 6vw, 80px)' }}
      >
        {/* Top — headline */}
        <div ref={linesRef} className="mt-20 sm:mt-12 max-w-[620px]">
          {HEADLINE_LINES.map((line) => (
            <div key={line} className="overflow-hidden leading-[0.92]">
              <div
                className="hl font-display font-black"
                style={{
                  fontSize: 'clamp(54px, 9vw, 118px)',
                  letterSpacing: '-0.03em',
                  color: 'var(--cream-50)',
                  lineHeight: 0.92,
                }}
              >
                {line}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row — meta + CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-8 sm:pb-4">
          {/* Descriptor */}
          <div ref={metaRef} style={{ opacity: 0 }}>
            <p
              className="font-mono uppercase tracking-widest mb-2"
              style={{ fontSize: '11px', color: 'var(--gold-500)', letterSpacing: '0.18em' }}
            >
              Full-stack engineer
            </p>
            <p
              className="font-sans"
              style={{ fontSize: '17px', color: 'var(--cream-300)', letterSpacing: '-0.01em', lineHeight: 1.5 }}
            >
              Databases · Web Dev · Content Systems
            </p>
          </div>

          {/* CTA buttons */}
          <div ref={ctaRef} className="flex gap-4 flex-wrap" style={{ opacity: 0 }}>
            <a href="#projects" data-cursor="hover" className="shiny-cta">
              <span>
                View Work
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>
            <a href="#contact" data-cursor="hover" className="shiny-cta shiny-ghost">
              <span>Let&apos;s Talk</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator — desktop only (mobile layout has no room and isMobile hides it) */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 hidden sm:flex"
        style={{ opacity: 0 }}
        aria-hidden
      >
        <span
          className="font-mono uppercase tracking-widest"
          style={{ fontSize: '10px', color: 'var(--cream-300)', letterSpacing: '0.2em' }}
        >
          Scroll
        </span>
        <div
          className="w-px animate-bounce"
          style={{ height: '36px', background: 'var(--cream-300)', opacity: 0.5 }}
        />
      </div>
    </section>
  )
}
