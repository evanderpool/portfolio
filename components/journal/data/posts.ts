import type { JournalPost } from '@/lib/journal'

export const posts: JournalPost[] = [
  {
    slug: 'schema-as-contract',
    title: 'Schema as Contract',
    excerpt: 'On treating every Postgres schema decision as a published interface.',
    year: 2025,
    readingTime: 6,
    tags: ['Databases', 'PostgreSQL', 'Architecture'],
    publishedAt: '2025-03-12',
  },
  {
    slug: 'content-systems-thinking',
    title: 'Content Systems Thinking',
    excerpt: 'Why your CMS is probably a database problem in disguise.',
    year: 2025,
    readingTime: 8,
    tags: ['Content', 'Systems', 'Engineering'],
    publishedAt: '2025-01-28',
  },
  {
    slug: 'ai-automation-signal-noise',
    title: 'AI Automation: Signal vs Noise',
    excerpt: 'Separating durable automation patterns from the hype cycle.',
    year: 2024,
    readingTime: 10,
    tags: ['AI', 'Automation', 'Strategy'],
    publishedAt: '2024-11-05',
  },
]
