'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'
import { milestones } from './data/milestones'

// All colors are readable on the dark forest-900 background
const SHAPE_COLORS: Record<string, string> = {
  icosahedron:  'var(--terracotta-500)',
  torus:        'var(--gold-500)',
  octahedron:   'var(--terracotta-400)',
  cylinder:     'var(--cream-300)',
  dodecahedron: 'var(--gold-500)',
}

export default function MobileTimeline() {
  const reduced = useReducedMotion()

  return (
    <section
      id="timeline"
      style={{ background: 'var(--forest-900)', position: 'relative' }}
      aria-label="Career timeline"
    >
      <div
        className="font-mono uppercase"
        style={{
          fontSize: '11px',
          letterSpacing: '0.18em',
          color: 'var(--gold-500)',
          padding: 'clamp(24px, 4vw, 40px) clamp(24px, 6vw, 48px)',
          paddingBottom: 0,
        }}
      >
        03.5 / Journey
      </div>

      <div
        style={{
          padding: 'clamp(40px, 8vw, 80px) clamp(24px, 6vw, 48px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(40px, 8vw, 64px)',
        }}
      >
        {milestones.map((m) => (
          <motion.article
            key={m.year}
            initial={reduced ? false : { opacity: 0, y: 40 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px 0px' }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              borderLeft: `2px solid ${SHAPE_COLORS[m.shape]}`,
              paddingLeft: 'clamp(16px, 4vw, 24px)',
            }}
          >
            <div
              className="font-display font-black italic"
              style={{
                fontSize: 'clamp(48px, 12vw, 72px)',
                letterSpacing: '-0.04em',
                lineHeight: 0.9,
                color: SHAPE_COLORS[m.shape],
              }}
            >
              {m.year}
            </div>

            <h3
              className="font-display italic"
              style={{
                fontSize: 'clamp(20px, 5vw, 28px)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: 'var(--cream-50)',
                margin: 0,
              }}
            >
              {m.title}
            </h3>

            <p
              className="font-sans"
              style={{
                fontSize: '15px',
                lineHeight: 1.65,
                color: 'var(--cream-300)',
                letterSpacing: '-0.01em',
                margin: 0,
              }}
            >
              {m.body}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
