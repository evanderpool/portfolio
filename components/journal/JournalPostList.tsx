'use client'
import { TransitionLink } from '@/components/transitions/TransitionLink'
import { posts } from './data/posts'

export default function JournalPostList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {posts.map((post, i) => (
        <TransitionLink
          key={post.slug}
          href={`/journal/${post.slug}`}
          data-cursor="hover"
          className="journal-post-row group"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'start',
            gap: '2rem',
            padding: 'clamp(24px, 3vw, 40px) 0',
            borderTop: i === 0 ? '1px solid var(--cream-300)' : 'none',
            borderBottom: '1px solid var(--cream-300)',
            textDecoration: 'none',
          }}
        >
          <div>
            {/* Eyebrow */}
            <p
              className="font-mono uppercase"
              style={{
                fontSize: '11px',
                color: 'var(--gold-500)',
                letterSpacing: '0.18em',
                marginBottom: '0.75rem',
              }}
            >
              {post.year} · {post.readingTime} min read
            </p>

            {/* Title */}
            <h3
              className="font-display italic journal-post-title"
              style={{
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                color: 'var(--forest-900)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                marginBottom: '0.75rem',
                transition: 'color 0.2s ease',
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
                lineHeight: 1.6,
                maxWidth: '60ch',
                marginBottom: '1rem',
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
          </div>

          {/* Arrow */}
          <span
            className="font-display italic"
            style={{
              fontSize: '28px',
              color: 'var(--cream-300)',
              lineHeight: 1,
              marginTop: '2px',
              flexShrink: 0,
              transition: 'color 0.2s ease',
            }}
          >
            →
          </span>
        </TransitionLink>
      ))}

      {/* CSS hover targeting child elements */}
      <style>{`
        .journal-post-row:hover .journal-post-title {
          color: var(--terracotta-500) !important;
        }
      `}</style>
    </div>
  )
}
