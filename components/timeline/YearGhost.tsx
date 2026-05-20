'use client'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'
import { milestones } from './data/milestones'
import type { ProgressRef } from './TimelineCanvas'

type Props = {
  progressRef: ProgressRef
}

export default function YearGhost({ progressRef }: Props) {
  const reduced      = useReducedMotion()
  const [activeYear, setActiveYear] = useState(milestones[0].year)
  const [parallaxY,  setParallaxY]  = useState(0)
  const prevYearRef  = useRef(milestones[0].year)

  useEffect(() => {
    let raf: number

    const tick = () => {
      const t   = progressRef.current.value
      const idx = Math.min(Math.floor(t * milestones.length), milestones.length - 1)
      const year = milestones[idx].year

      // Only setState when year actually changes — avoids per-frame React re-renders
      if (year !== prevYearRef.current) {
        prevYearRef.current = year
        setActiveYear(year)
      }

      // Gentle vertical parallax — 30px range over full scroll
      setParallaxY(t * -30)

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progressRef])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 'clamp(60px, 10vh, 120px)',
        right: 'clamp(24px, 6vw, 80px)',
        pointerEvents: 'none',
        userSelect: 'none',
        transform: `translateY(${parallaxY}px)`,
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={activeYear}
          className="font-display font-black"
          style={{
            display: 'block',
            fontSize: '32vw',
            lineHeight: 0.85,
            letterSpacing: '-0.06em',
            color: 'var(--cream-100)',
            opacity: 0.1,
          }}
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 0.1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          {activeYear}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
