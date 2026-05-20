import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import { TransitionLink } from '@/components/transitions/TransitionLink'
import { projects } from '@/components/projects/data/projects'

interface Props {
  params: Promise<{ slug: string }>
}

function projectSlug(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-')
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: projectSlug(p.title) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => projectSlug(p.title) === slug)
  return {
    title: project ? project.title : slug,
    description: project?.subtitle,
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const project = projects.find((p) => projectSlug(p.title) === slug)

  const jsonLd = project
    ? {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: project.subtitle,
        author: {
          '@type': 'Person',
          name: 'Erick Vanderpool',
          url: 'https://erickvanderpool.com',
        },
        dateCreated: String(project.year),
        keywords: project.tags.join(', '),
      }
    : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <main style={{ background: 'var(--cream-100)', minHeight: '100dvh' }}>
        <Nav />

        {/* Hero */}
        <section
          style={{
            padding: 'clamp(120px, 14vw, 180px) clamp(24px, 6vw, 80px) clamp(60px, 8vw, 100px)',
            borderBottom: '1px solid var(--cream-300)',
          }}
        >
          {/* Back link */}
          <TransitionLink
            href="/work"
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
            ← Work
          </TransitionLink>

          {/* Role / year */}
          <p
            className="font-mono uppercase tracking-[0.2em]"
            style={{ fontSize: '11px', color: 'var(--gold-500)', marginBottom: '1.5rem' }}
          >
            {project?.year ?? '—'} · {project?.role ?? '—'}
          </p>

          {/* Title */}
          <h1
            className="font-display italic"
            style={{
              fontSize: 'clamp(54px, 9vw, 118px)',
              letterSpacing: '-0.03em',
              color: 'var(--forest-900)',
              lineHeight: 0.95,
              marginBottom: '1.5rem',
            }}
          >
            {project?.title ?? slug}
          </h1>

          {/* Subtitle */}
          <p
            className="font-sans"
            style={{
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              color: 'var(--forest-600)',
              letterSpacing: '-0.01em',
              lineHeight: 1.4,
              maxWidth: '52ch',
              marginBottom: '2rem',
            }}
          >
            {project?.subtitle}
          </p>

          {/* Tags */}
          {project && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    color: 'var(--terracotta-500)',
                    border: '1px solid var(--terracotta-500)',
                    borderRadius: '999px',
                    padding: '4px 10px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Placeholder content */}
        <section
          style={{
            padding: 'clamp(60px, 8vw, 100px) clamp(24px, 6vw, 80px)',
            maxWidth: '72ch',
          }}
        >
          <p
            className="font-sans"
            style={{
              fontSize: '18px',
              color: 'var(--forest-600)',
              lineHeight: 1.7,
              letterSpacing: '-0.01em',
            }}
          >
            Full case study coming soon. This project covers {project?.role?.toLowerCase() ?? 'engineering work'} — check back for the detailed write-up.
          </p>
        </section>
      </main>
    </>
  )
}
