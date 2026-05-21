import type { Metadata } from 'next'
import AnimatedNav      from '@/components/ui/navigation-menu'
import JournalPostList from '@/components/journal/JournalPostList'
import { getPosts }    from '@/lib/journal'

// Revalidate every 60 s so new published posts appear without a full rebuild
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Writing on databases, web development, AI automation, and content systems.',
}

export default async function JournalPage() {
  const posts = await getPosts()

  return (
    <main style={{ background: 'var(--cream-100)', minHeight: '100dvh' }}>
      <AnimatedNav />

      <div style={{ padding: 'clamp(120px, 14vw, 180px) clamp(24px, 6vw, 80px) clamp(80px, 10vw, 140px)' }}>
        {/* Header */}
        <div style={{ marginBottom: 'clamp(48px, 6vw, 80px)' }}>
          <p
            className="font-mono uppercase tracking-[0.2em]"
            style={{ fontSize: '11px', color: 'var(--gold-500)', marginBottom: '1.5rem' }}
          >
            Writing
          </p>
          <h1
            className="font-display italic"
            style={{
              fontSize: 'clamp(54px, 9vw, 118px)',
              letterSpacing: '-0.03em',
              color: 'var(--forest-900)',
              lineHeight: 0.95,
            }}
          >
            Journal
          </h1>
        </div>

        {posts.length > 0 ? (
          <JournalPostList posts={posts} />
        ) : (
          <p
            className="font-sans"
            style={{ fontSize: '17px', color: 'var(--forest-600)', letterSpacing: '-0.01em', opacity: 0.6 }}
          >
            Posts coming soon.
          </p>
        )}
      </div>
    </main>
  )
}
