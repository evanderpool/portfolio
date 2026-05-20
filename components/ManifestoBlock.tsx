'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'

const QUOTE =
  'Good software is edited. Every schema, every query, every interface deserves the same care as a sentence going to print.'

const wordVariants = {
  hidden:  { y: '80%', opacity: 0 },
  visible: { y: '0%',  opacity: 1 },
}

export default function ManifestoBlock() {
  const reduced = useReducedMotion()

  return (
    <section
      style={{
        background: 'var(--cream-100)',
        padding: 'clamp(80px, 12vw, 160px) clamp(24px, 6vw, 80px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {/* Gold rule */}
      <div
        style={{
          width: '48px',
          height: '1px',
          background: 'var(--gold-500)',
          opacity: 0.4,
          marginBottom: '3rem',
        }}
      />

      <blockquote
        style={{
          maxWidth: '720px',
          margin: 0,
          padding: 0,
          fontSize: 'clamp(28px, 4vw, 48px)',
          lineHeight: 1.25,
          color: 'var(--forest-800)',
          letterSpacing: '-0.025em',
        }}
        aria-label={QUOTE}
      >
        <motion.span
          aria-hidden="true"
          style={{ display: 'block' }}
          initial={reduced ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px 0px' }}
          transition={{ staggerChildren: 0.07, delayChildren: 0.1 }}
        >
          {QUOTE.split(' ').map((word, i) => (
            <span
              key={i}
              style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
            >
              <motion.span
                variants={wordVariants}
                style={{ display: 'inline-block', marginRight: '0.28em' }}
                transition={{ duration: 0.75, ease: EASE_OUT }}
                className="font-display italic"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.span>
      </blockquote>

      <p
        className="font-mono uppercase"
        style={{
          fontSize: '11px',
          color: 'var(--gold-500)',
          letterSpacing: '0.2em',
          marginTop: '3rem',
        }}
      >
        Erick Vanderpool — 2025
      </p>
    </section>
  )
}
