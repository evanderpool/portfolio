import type { Metadata } from 'next'
import { notFound }            from 'next/navigation'
import AnimatedNav              from '@/components/ui/navigation-menu'
import { TransitionLink }       from '@/components/transitions/TransitionLink'
import { getPostBySlug }        from '@/lib/journal'
import PostBody                 from '@/components/journal/PostBody'

// Revalidate every 60 s — new published content appears without a full rebuild
export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function JournalArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <main style={{ background: 'var(--cream-100)', minHeight: '100dvh' }}>
      <AnimatedNav />

      {/* Article header */}
      <header
        style={{
          padding: 'clamp(120px, 14vw, 180px) clamp(24px, 6vw, 80px) clamp(48px, 6vw, 80px)',
          borderBottom: '1px solid var(--cream-300)',
          maxWidth: '900px',
        }}
      >
        <TransitionLink
          href="/journal"
          data-cursor="hover"
          className="font-mono uppercase tracking-[0.15em]"
          style={{
            fontSize: '11px',
            color: 'var(--gold-500)',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: '2rem',
          }}
        >
          ← Journal
        </TransitionLink>

        {/* Eyebrow */}
        <p
          className="font-mono uppercase tracking-[0.2em]"
          style={{ fontSize: '11px', color: 'var(--gold-500)', marginBottom: '1.5rem' }}
        >
          {post.year} · {post.readingTime} min read
        </p>

        {/* Title */}
        <h1
          className="font-display italic"
          style={{
            fontSize: 'clamp(38px, 6vw, 72px)',
            letterSpacing: '-0.03em',
            color: 'var(--forest-900)',
            lineHeight: 1.05,
            marginBottom: '1.5rem',
          }}
        >
          {post.title}
        </h1>

        {/* Excerpt (lede) */}
        <p
          className="font-sans"
          style={{
            fontSize: 'clamp(18px, 2vw, 22px)',
            color: 'var(--forest-600)',
            letterSpacing: '-0.01em',
            lineHeight: 1.55,
            maxWidth: '56ch',
            marginBottom: '2rem',
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
      </header>

      {/* Article body */}
      <article
        style={{
          padding: 'clamp(48px, 6vw, 80px) clamp(24px, 6vw, 80px)',
          maxWidth: '72ch',
        }}
      >
        {post.content ? (
          <PostBody content={post.content} />
        ) : (
          <p
            className="font-sans"
            style={{
              fontSize: '18px',
              color: 'var(--forest-600)',
              lineHeight: 1.7,
              letterSpacing: '-0.01em',
              opacity: 0.6,
            }}
          >
            Full article coming soon.
          </p>
        )}
      </article>
    </main>
  )
}
