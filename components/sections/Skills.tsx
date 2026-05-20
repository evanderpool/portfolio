'use client'
import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getPrefersReducedMotion } from '@/lib/motion'

const SkillsScene = dynamic(() => import('./SkillsScene'), { ssr: false })

gsap.registerPlugin(ScrollTrigger)

const SKILLS = [
  { name: 'PostgreSQL', level: 92, category: 'Databases'  },
  { name: 'Redis',      level: 85, category: 'Databases'  },
  { name: 'MySQL',      level: 80, category: 'Databases'  },
  { name: 'Next.js',   level: 95, category: 'Frontend'   },
  { name: 'React',     level: 95, category: 'Frontend'   },
  { name: 'TypeScript', level: 90, category: 'Frontend'   },
  { name: 'Node.js',   level: 88, category: 'Backend'    },
  { name: 'Prisma',    level: 85, category: 'Backend'    },
  { name: 'GSAP',      level: 80, category: 'Tools'      },
  { name: 'Git/GitHub', level: 90, category: 'Tools'      },
]

const CATEGORY_COLORS: Record<string, string> = {
  Databases: 'var(--gold-500)',
  Frontend:  'var(--forest-600)',
  Backend:   'var(--terracotta-500)',
  Tools:     'var(--forest-400)',
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const barsRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const bars    = barsRef.current
    if (!section || !bars) return
    if (getPrefersReducedMotion()) return

    const ctx = gsap.context(() => {
      bars.querySelectorAll<HTMLElement>('.skill-fill').forEach((fill) => {
        const level = fill.dataset.level ?? '0'
        gsap.fromTo(
          fill,
          { width: '0%' },
          {
            width: `${level}%`,
            duration: 1.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: fill,
              start: 'top 88%',
            },
          }
        )
      })

      gsap.fromTo(
        bars.querySelectorAll('.skill-row'),
        { x: 24, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  const categories = [...new Set(SKILLS.map((s) => s.category))]

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full"
      style={{ background: 'var(--cream-100)', padding: 'clamp(80px, 12vw, 160px) clamp(24px, 6vw, 80px)' }}
    >
      {/* Section label */}
      <div
        className="absolute top-10 left-[clamp(24px,6vw,80px)] font-mono uppercase tracking-[0.2em]"
        style={{ fontSize: '11px', color: 'var(--gold-500)' }}
      >
        03 / Skills
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
        {/* 3D Orbital */}
        <div className="w-full aspect-square max-w-[480px] mx-auto md:mx-0">
          <SkillsScene />
        </div>

        {/* Skill categories */}
        <div ref={barsRef} className="flex flex-col gap-10">
          <h2
            className="font-display font-black leading-[0.94]"
            style={{
              fontSize: 'clamp(36px, 5vw, 58px)',
              letterSpacing: '-0.03em',
              color: 'var(--forest-900)',
            }}
          >
            Expertise
            <br />
            <em style={{ color: 'var(--terracotta-500)' }}>& tools.</em>
          </h2>

          <div className="flex flex-col gap-8">
            {categories.map((cat) => (
              <div key={cat}>
                <p
                  className="font-mono uppercase mb-3"
                  style={{
                    fontSize: '11px',
                    color: CATEGORY_COLORS[cat] ?? 'var(--forest-400)',
                    letterSpacing: '0.16em',
                  }}
                >
                  {cat}
                </p>
                <div className="flex flex-col gap-3">
                  {SKILLS.filter((s) => s.category === cat).map((skill) => (
                    <div key={skill.name} className="skill-row flex flex-col gap-1.5" style={{ opacity: 0 }}>
                      <div className="flex items-center justify-between">
                        <span
                          className="font-sans font-medium"
                          style={{ fontSize: '14px', color: 'var(--forest-800)', letterSpacing: '-0.01em' }}
                        >
                          {skill.name}
                        </span>
                        <span
                          className="font-display italic"
                          style={{ fontSize: '13px', color: CATEGORY_COLORS[cat] ?? 'var(--gold-500)' }}
                        >
                          {skill.level}
                        </span>
                      </div>
                      <div
                        className="w-full rounded-full overflow-hidden"
                        style={{ height: '4px', background: 'var(--cream-300)' }}
                      >
                        <div
                          className="skill-fill h-full rounded-full"
                          data-level={skill.level}
                          style={{
                            width: '0%',
                            background: CATEGORY_COLORS[cat] ?? 'var(--terracotta-500)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
