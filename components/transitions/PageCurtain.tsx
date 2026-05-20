'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useTransition } from '@/store/transition'
import { DUR_CURTAIN_IN, DUR_CURTAIN_OUT, STAGGER_STRIP, getPrefersReducedMotion } from '@/lib/motion'

const stripColor = (i: number) =>
  i % 2 === 0 ? 'var(--terracotta-500)' : 'var(--terracotta-600)'

export function PageCurtain() {
  const stripsRef = useRef<(HTMLDivElement | null)[]>([])
  const [stripCount, setStripCount] = useState(8)
  const { isTransitioning } = useTransition()

  // On mount, switch to 4 strips on mobile
  useEffect(() => {
    const count = window.innerWidth < 768 ? 4 : 8
    setStripCount(count)
  }, [])

  // Set initial off-screen position whenever strip count changes
  useEffect(() => {
    stripsRef.current.length = stripCount
    const strips = stripsRef.current.filter((s): s is HTMLDivElement => s !== null)
    gsap.set(strips, { yPercent: 100 })
  }, [stripCount])

  useEffect(() => {
    const strips = stripsRef.current.filter((s): s is HTMLDivElement => s !== null)
    if (!strips.length) return
    if (getPrefersReducedMotion()) return

    const ctx = gsap.context(() => {
      if (isTransitioning) {
        gsap.fromTo(
          strips,
          { yPercent: -100 },
          {
            yPercent: 0,
            duration: DUR_CURTAIN_IN,
            ease: 'power4.inOut',
            stagger: { each: STAGGER_STRIP, from: 'start' },
          }
        )
      } else {
        gsap.to(strips, {
          yPercent: 100,
          duration: DUR_CURTAIN_OUT,
          ease: 'power4.inOut',
          stagger: { each: STAGGER_STRIP, from: 'end' },
        })
      }
    })

    return () => ctx.revert()
  }, [isTransitioning, stripCount])

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] pointer-events-none flex"
    >
      {Array.from({ length: stripCount }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { stripsRef.current[i] = el }}
          className="flex-1"
          style={{
            backgroundColor: stripColor(i),
            transform: 'translateY(100%)',
          }}
        />
      ))}
    </div>
  )
}
