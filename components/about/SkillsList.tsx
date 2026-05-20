'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getPrefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger)

const SKILLS = [
  {
    num: '01',
    label: 'POSTGRESQL · SQL · DATA INTEGRITY',
    sub: 'Schema design, migration planning, query cleanup',
    percent: 95,
  },
  {
    num: '02',
    label: 'NEXT.JS · TYPESCRIPT · REACT',
    sub: 'Interactive interfaces, app router, dashboards',
    percent: 88,
  },
  {
    num: '03',
    label: 'AI AUTOMATION · AGENT SYSTEMS',
    sub: 'Workflow orchestration, assistant teams, MCP tools',
    percent: 84,
  },
  {
    num: '04',
    label: 'CONTENT SYSTEMS · AFFILIATE OPS',
    sub: 'CMS architecture, content pipelines, monetization',
    percent: 80,
  },
  {
    num: '05',
    label: 'WRITING · DOCS · STRATEGY',
    sub: 'Technical writing, editorial systems, audience building',
    percent: 76,
  },
]

export default function SkillsList() {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = listRef.current
    if (!el) return

    const fills = Array.from(el.querySelectorAll<HTMLElement>('[data-skill-fill]'))
    const nums  = Array.from(el.querySelectorAll<HTMLElement>('[data-skill-num]'))

    if (getPrefersReducedMotion()) {
      fills.forEach((fill, i) => { fill.style.width = `${SKILLS[i].percent}%` })
      nums.forEach((num, i)   => { num.textContent  = `${SKILLS[i].percent}%` })
      return
    }

    const ctx = gsap.context(() => {
      SKILLS.forEach((skill, i) => {
        const fill    = fills[i]
        const numEl   = nums[i]
        const counter = { value: 0 }
        const trigger = { trigger: el, start: 'top 82%', once: true }

        gsap.fromTo(
          fill,
          { width: '0%' },
          { width: `${skill.percent}%`, duration: 1.4, ease: 'power3.out', delay: i * 0.08, scrollTrigger: trigger }
        )

        gsap.to(counter, {
          value: skill.percent,
          duration: 1.4,
          ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: trigger,
          onUpdate() { numEl.textContent = `${Math.round(counter.value)}%` },
        })
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={listRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {SKILLS.map((skill) => (
        <div key={skill.num} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', minWidth: 0 }}>
              <span
                className="font-mono"
                style={{ fontSize: '11px', color: 'var(--gold-500)', letterSpacing: '0.1em', flexShrink: 0 }}
              >
                {skill.num}
              </span>
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: '10px',
                  color: 'var(--forest-600)',
                  letterSpacing: '0.1em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {skill.label}
              </span>
            </div>
            <span
              data-skill-num
              className="font-mono tabular-nums"
              style={{ fontSize: '12px', color: 'var(--terracotta-500)', letterSpacing: '0.05em', flexShrink: 0 }}
            >
              0%
            </span>
          </div>

          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '2px',
              background: 'var(--cream-300)',
              borderRadius: '1px',
              overflow: 'hidden',
            }}
          >
            <div
              data-skill-fill
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: '0%',
                background: 'var(--terracotta-500)',
                borderRadius: '1px',
              }}
            />
          </div>

          <span
            className="font-sans"
            style={{ fontSize: '12px', color: 'var(--forest-400)', letterSpacing: '-0.005em' }}
          >
            {skill.sub}
          </span>
        </div>
      ))}
    </div>
  )
}
