'use client'
import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getPrefersReducedMotion } from '@/lib/motion'

const AboutScene = dynamic(() => import('./AboutScene'), { ssr: false })

gsap.registerPlugin(ScrollTrigger)

const STACK = [
  'PostgreSQL', 'Redis', 'MySQL',
  'Next.js', 'TypeScript', 'React',
  'Node.js', 'Prisma', 'GSAP',
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef    = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (getPrefersReducedMotion()) return
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        canvasRef.current,
        { opacity: 0, scale: 0.88 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 75%' },
        }
      )

      gsap.fromTo(
        textRef.current!.querySelectorAll('.reveal'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
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
      id="about"
      className="relative w-full"
      style={{ background: 'var(--cream-200)', padding: 'clamp(80px, 12vw, 160px) clamp(24px, 6vw, 80px)' }}
    >
      {/* Section label */}
      <div
        className="absolute top-10 left-[clamp(24px,6vw,80px)] font-mono uppercase tracking-[0.2em]"
        style={{ fontSize: '11px', color: 'var(--gold-500)' }}
      >
        01 / About
      </div>

      {/* Horizontal rule */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'var(--terracotta-500)', opacity: 0.35 }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center max-w-6xl mx-auto">
        {/* 3D canvas */}
        <div
          ref={canvasRef}
          className="w-full aspect-square max-w-[480px] mx-auto md:mx-0"
          style={{ opacity: 0 }}
        >
          <AboutScene />
        </div>

        {/* Text */}
        <div ref={textRef} className="flex flex-col gap-8">
          <h2
            className="reveal font-display font-black leading-[0.94]"
            style={{
              fontSize: 'clamp(38px, 5.5vw, 64px)',
              letterSpacing: '-0.03em',
              color: 'var(--forest-900)',
            }}
          >
            Building things
            <br />
            <em style={{ color: 'var(--terracotta-500)' }}>that last.</em>
          </h2>

          <p
            className="reveal font-sans leading-relaxed"
            style={{ fontSize: '17px', color: 'var(--forest-600)', letterSpacing: '-0.01em' }}
          >
            I&apos;m a full-stack engineer with a focus on data-driven systems and content infrastructure.
            I design and build web applications where database architecture, clean APIs, and compelling
            frontend experiences come together.
          </p>

          <p
            className="reveal font-sans leading-relaxed"
            style={{ fontSize: '17px', color: 'var(--forest-400)', letterSpacing: '-0.01em' }}
          >
            Beyond code, I create content about the craft — breaking down complex concepts
            in databases, web development patterns, and the intersection of engineering and writing.
          </p>

          {/* Stack pills */}
          <div className="reveal flex flex-wrap gap-2">
            {STACK.map((tech) => (
              <span
                key={tech}
                data-cursor="hover"
                className="font-mono text-xs px-3 py-1.5 rounded-full transition-all duration-200"
                style={{
                  background: 'var(--cream-50)',
                  border: '1px solid var(--cream-300)',
                  color: 'var(--forest-600)',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'var(--terracotta-500)'
                  el.style.color = 'var(--terracotta-500)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'var(--cream-300)'
                  el.style.color = 'var(--forest-600)'
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Open to badge */}
          <div className="reveal">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 font-display italic"
              style={{
                background: 'var(--gold-300)',
                color: 'var(--ink)',
                borderRadius: '4px',
                fontSize: '15px',
              }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: 'var(--forest-900)' }}
              />
              Currently open to new projects
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
