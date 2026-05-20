'use client'
import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getPrefersReducedMotion } from '@/lib/motion'

const ProjectsScene = dynamic(() => import('./ProjectsScene'), { ssr: false })

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    num: '01',
    title: 'DataFlow',
    tags: ['PostgreSQL', 'Next.js', 'Prisma', 'TypeScript'],
    desc: 'A real-time data pipeline dashboard with live query visualization and performance analytics built for engineering teams.',
    href: '#',
    accent: 'var(--terracotta-500)',
  },
  {
    num: '02',
    title: 'ContentOS',
    tags: ['Redis', 'Node.js', 'React', 'REST API'],
    desc: 'Headless CMS and content distribution platform with intelligent caching, multi-channel publishing, and schema validation.',
    href: '#',
    accent: 'var(--gold-500)',
  },
  {
    num: '03',
    title: 'Scribe',
    tags: ['MySQL', 'Next.js', 'MDX', 'GSAP'],
    desc: 'Editorial publishing platform for technical writers. Markdown-first workflow with automated SEO, syntax highlighting, and reader analytics.',
    href: '#',
    accent: 'var(--forest-400)',
  },
]

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const track     = trackRef.current
    if (!container || !track) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      if (getPrefersReducedMotion()) return

      const getScrollDist = () => track.scrollWidth - window.innerWidth

      const tween = gsap.to(track, {
        x: () => -getScrollDist(),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1.2,
          start: 'top top',
          end: () => `+=${getScrollDist()}`,
          invalidateOnRefresh: true,
        },
      })

      return () => {
        tween.scrollTrigger?.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      id="projects"
      style={{ background: 'var(--forest-900)' }}
    >
      {/* Section label */}
      <div
        className="relative z-10 pt-12 pb-0 px-[clamp(24px,6vw,80px)] font-mono uppercase tracking-[0.2em]"
        style={{ fontSize: '11px', color: 'var(--gold-500)' }}
      >
        02 / Work
      </div>

      {/* Particle background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <ProjectsScene />
      </div>

      {/* Horizontal scroll container */}
      <div ref={containerRef} className="relative overflow-hidden">
        <div
          ref={trackRef}
          className="flex items-center gap-8 md:gap-12"
          style={{ padding: 'clamp(48px, 8vw, 100px) clamp(24px, 6vw, 80px)' }}
        >
          {PROJECTS.map((p) => (
            <ProjectCard key={p.num} project={p} />
          ))}
          {/* End spacer */}
          <div className="shrink-0 w-[clamp(24px,6vw,80px)]" aria-hidden />
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: (typeof PROJECTS)[0] }) {
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={cardRef}
      data-cursor="hover"
      className="shrink-0 relative flex flex-col justify-between rounded-2xl overflow-hidden transition-all duration-300 group"
      style={{
        width: 'clamp(300px, 38vw, 500px)',
        height: '76vh',
        minHeight: '420px',
        background: 'var(--cream-200)',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'
        ;(e.currentTarget as HTMLElement).style.boxShadow =
          '0 24px 64px rgba(0,0,0,0.22)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
      }}
    >
      {/* Large decorative number */}
      <div
        className="absolute top-4 left-6 font-display font-black pointer-events-none select-none"
        style={{
          fontSize: 'clamp(80px, 12vw, 140px)',
          color: 'var(--forest-900)',
          opacity: 0.06,
          lineHeight: 1,
          letterSpacing: '-0.04em',
        }}
        aria-hidden
      >
        {project.num}
      </div>

      {/* Gradient placeholder */}
      <div
        className="flex-1 mx-6 mt-6 rounded-xl"
        style={{
          background: `linear-gradient(135deg, var(--cream-300) 0%, var(--cream-200) 60%, ${project.accent}22 100%)`,
          minHeight: '220px',
        }}
      />

      {/* Card content */}
      <div className="p-6 flex flex-col gap-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] px-2.5 py-1 rounded-full"
              style={{
                border: `1px solid ${project.accent}`,
                color: project.accent,
                letterSpacing: '0.04em',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3
          className="font-display font-black leading-[0.95]"
          style={{
            fontSize: 'clamp(28px, 3.5vw, 42px)',
            letterSpacing: '-0.03em',
            color: 'var(--forest-900)',
          }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          className="font-sans leading-snug"
          style={{ fontSize: '14px', color: 'var(--forest-600)', letterSpacing: '-0.005em' }}
        >
          {project.desc}
        </p>

        {/* Link */}
        <a
          href={project.href}
          className="inline-flex items-center gap-1.5 font-sans text-sm font-medium group/link w-fit"
          style={{ color: project.accent }}
        >
          <span className="border-b border-transparent group-hover/link:border-current transition-colors">
            View Project
          </span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  )
}
