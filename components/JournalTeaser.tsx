'use client'
import { motion, useReducedMotion } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'
import { TransitionLink } from '@/components/transitions/TransitionLink'
import { useMagneticTilt } from '@/components/projects/hooks/useMagneticTilt'
import type { JournalPost } from '@/lib/journal'

interface Props {
  posts: JournalPost[]
}

const cardVariants = {
  hidden:  { y: 40, opacity: 0 },
  visible: { y: 0,  opacity: 1 },
}

function JournalCard({ post }: { post: JournalPost }) {
  const tiltRef = useMagneticTilt(8)

  return (
    <motion.div
      variants={cardVariants}
      transition={{ duration: 0.7, ease: EASE_OUT }}
    >
      <div
        ref={tiltRef}
        style={{
          transformStyle: 'preserve-3d',
          borderTop: '1px solid var(--cream-300)',
          paddingTop: '1.5rem',
          paddingBottom: '1.5rem',
          cursor: 'pointer',
        }}
        data-cursor="hover"
      >
        <TransitionLink
          href={`/journal/${post.slug}`}
          style={{ display: 'block', textDecoration: 'none' }}
        >
          {/* Eyebrow */}
          <div
            className="font-mono uppercase"
            style={{ fontSize: '11px', color: 'var(--gold-500)', letterSpacing: '0.18em', marginBottom: '0.75rem' }}
          >
            {post.year} · {post.readingTime} min read
          </div>

          {/* Title */}
          <h3
            className="font-display italic"
            style={{
              fontSize: 'clamp(22px, 2vw, 28px)',
              color: 'var(--forest-800)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '0.875rem',
            }}
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          <p
            className="font-sans"
            style={{
              fontSize: '15px',
              color: 'var(--forest-600)',
              opacity: 0.75,
              letterSpacing: '-0.01em',
              lineHeight: 1.65,
              marginBottom: '1rem',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {post.excerpt}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono uppercase"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  color: 'var(--terracotta-500)',
                  border: '1px solid var(--terracotta-500)',
                  borderRadius: '999px',
                  padding: '3px 8px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </TransitionLink>
      </div>
    </motion.div>
  )
}

export default function JournalTeaser({ posts }: Props) {
  const reduced = useReducedMotion()

  return (
    <section
      id="journal"
      style={{
        background: 'var(--cream-100)',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px)',
        position: 'relative',
      }}
    >
      {/* Section label */}
      <div
        className="font-mono uppercase tracking-[0.2em]"
        style={{ fontSize: '11px', color: 'var(--gold-500)', marginBottom: '3rem' }}
      >
        05.5 / Journal
      </div>

      {/* Heading */}
      <h2
        className="font-display italic"
        style={{
          fontSize: 'clamp(38px, 5vw, 56px)',
          letterSpacing: '-0.03em',
          lineHeight: 1.0,
          color: 'var(--forest-900)',
          marginBottom: '3rem',
        }}
      >
        Latest writing
      </h2>

      {posts.length === 0 ? (
        <p
          className="font-sans"
          style={{ fontSize: '16px', color: 'var(--forest-600)', opacity: 0.5 }}
        >
          Posts coming soon.
        </p>
      ) : (
        <motion.div
          initial={reduced ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-60px 0px' }}
          transition={{ staggerChildren: 0.12 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-y-0 gap-x-12"
        >
          {posts.map((post) => (
            <JournalCard key={post.slug} post={post} />
          ))}
        </motion.div>
      )}

      {/* View all */}
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <TransitionLink
          href="/journal"
          data-cursor="hover"
          className="font-display italic"
          style={{
            fontSize: '20px',
            color: 'var(--terracotta-500)',
            letterSpacing: '-0.02em',
            textDecoration: 'none',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLElement).style.opacity = '0.7'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLElement).style.opacity = '1'
          }}
        >
          Read all writing →
        </TransitionLink>
      </div>
    </section>
  )
}
