'use client'
import { useEffect } from 'react'
import { motion, useMotionValue, useReducedMotion } from 'framer-motion'
import type { Milestone } from './data/milestones'
import type { ProgressRef } from './TimelineCanvas'

type Props = {
  milestone: Milestone
  index: number
  total: number
  progressRef: ProgressRef
}

export default function MilestoneCaption({ milestone, index, total, progressRef }: Props) {
  const reduced = useReducedMotion()
  const opacity = useMotionValue(0)
  const xVal    = useMotionValue(-40)

  // Visibility window for this milestone
  const startT = index / total
  const endT   = (index + 0.7) / total

  useEffect(() => {
    let raf: number

    const tick = () => {
      const t = progressRef.current.value
      let o = 0

      if (t >= startT && t <= endT) {
        // Ramp in over first 10% of the window, ramp out over last 10%
        const rampIn  = Math.min((t - startT) / 0.1, 1)
        const rampOut = Math.min((endT - t) / 0.1, 1)
        o = Math.min(rampIn, rampOut)
      }

      opacity.set(reduced ? (o > 0.5 ? 1 : 0) : o)
      xVal.set(reduced ? 0 : -40 + o * 40)

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progressRef, startT, endT, opacity, xVal, reduced])

  return (
    <motion.div
      style={{
        position: 'absolute',
        bottom: 'clamp(48px, 8vh, 80px)',
        left: 'clamp(24px, 6vw, 80px)',
        opacity,
        x: xVal,
        pointerEvents: 'none',
        maxWidth: '420px',
      }}
    >
      <div
        className="font-display font-black italic"
        style={{
          fontSize: 'clamp(48px, 6vw, 72px)',
          letterSpacing: '-0.04em',
          lineHeight: 0.9,
          color: 'var(--gold-500)',
        }}
      >
        {milestone.year}
      </div>

      <div
        className="font-display italic"
        style={{
          fontSize: 'clamp(22px, 3vw, 36px)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          color: 'var(--cream-50)',
          marginTop: '0.25em',
        }}
      >
        {milestone.title}
      </div>

      <p
        className="font-sans"
        style={{
          fontSize: '16px',
          lineHeight: 1.65,
          color: 'var(--cream-300)',
          maxWidth: '380px',
          marginTop: '0.75em',
          letterSpacing: '-0.01em',
          margin: '0.75em 0 0',
        }}
      >
        {milestone.body}
      </p>
    </motion.div>
  )
}
