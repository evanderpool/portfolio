import type { Metadata } from 'next'
import Nav             from '@/components/Nav'
import JournalPostList from '@/components/journal/JournalPostList'

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Writing on databases, web development, AI automation, and content systems.',
}

export default function JournalPage() {
  return (
    <main style={{ background: 'var(--cream-100)', minHeight: '100dvh' }}>
      <Nav />

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

        <JournalPostList />
      </div>
    </main>
  )
}
