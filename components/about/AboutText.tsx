'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'

const HEADLINE = 'Editorial systems, written in code.'

const charVariants = {
  hidden:  { y: '80%', opacity: 0 },
  visible: { y: '0%',  opacity: 1 },
}

const paraContainer = {
  hidden:  {},
  visible: {},
}

const paraChild = {
  hidden:  { y: 24, opacity: 0 },
  visible: { y: 0,  opacity: 1 },
}

const PARA_TRANSITION = {
  duration: 0.85,
  ease: EASE_OUT,
}

export default function AboutText() {
  const reduced = useReducedMotion()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <span
        className="font-mono uppercase"
        style={{ fontSize: '11px', color: 'var(--gold-500)', letterSpacing: '0.18em' }}
      >
        ABOUT — 02 / 05
      </span>

      <h2
        className="font-display font-black italic"
        style={{
          fontSize: 'clamp(38px, 5.5vw, 64px)',
          letterSpacing: '-0.03em',
          lineHeight: 1.0,
          color: 'var(--forest-900)',
        }}
        aria-label={HEADLINE}
      >
        <motion.span
          aria-hidden="true"
          style={{ display: 'block' }}
          initial={reduced ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px 0px' }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
        >
          {HEADLINE.split(' ').map((word, wi) => (
            <span key={wi} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
              <motion.span
                variants={charVariants}
                style={{ display: 'inline-block', marginRight: '0.28em' }}
                transition={{ duration: 0.75, ease: EASE_OUT }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.span>
      </h2>

      <motion.div
        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
        initial={reduced ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px 0px' }}
        variants={paraContainer}
        transition={{ staggerChildren: 0.15 }}
      >
        <motion.p
          variants={paraChild}
          transition={PARA_TRANSITION}
          className="font-sans"
          style={{
            fontSize: '18px',
            maxWidth: '56ch',
            color: 'var(--forest-800)',
            letterSpacing: '-0.01em',
            lineHeight: 1.65,
          }}
        >
          I build full-stack systems with a writer&apos;s eye — clean schemas, content
          pipelines, and useful interfaces that make technical work feel human.
        </motion.p>

        <motion.p
          variants={paraChild}
          transition={PARA_TRANSITION}
          className="font-sans"
          style={{
            fontSize: '18px',
            maxWidth: '56ch',
            color: 'var(--forest-800)',
            letterSpacing: '-0.01em',
            lineHeight: 1.65,
          }}
        >
          My work lives at the seam between databases, design, and automation. I treat
          queries like sentences and dashboards like decision engines.
        </motion.p>

        <motion.p
          variants={paraChild}
          transition={PARA_TRANSITION}
          className="font-sans"
          style={{
            fontSize: '18px',
            maxWidth: '56ch',
            color: 'var(--forest-600)',
            letterSpacing: '-0.01em',
            lineHeight: 1.65,
          }}
        >
          Currently building Artificial Management: AI-assisted systems for small
          businesses, creators, and teams that want cleaner operations.
        </motion.p>
      </motion.div>
    </div>
  )
}
