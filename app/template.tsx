'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTransition } from '@/store/transition'
import { EASE_OUT, DELAY_CONTENT, getPrefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger)

const pageVariants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE_OUT,
      delay: DELAY_CONTENT,
      staggerChildren: 0.06,
    },
  },
}

export default function Template({ children }: { children: ReactNode }) {
  const complete = useTransition((s) => s.complete)
  // Capture isTransitioning at mount time — before complete() resets it.
  const wasTransitioning = useRef(useTransition.getState().isTransitioning)

  useEffect(() => {
    complete()
    // Recalculate all ScrollTrigger positions for the new page's DOM heights.
    ScrollTrigger.refresh()

    return () => {
      // Kill all triggers on unmount so the incoming page starts clean.
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!wasTransitioning.current || getPrefersReducedMotion()) {
    return <>{children}</>
  }

  return (
    <motion.div initial="initial" animate="animate" variants={pageVariants}>
      {children}
    </motion.div>
  )
}
