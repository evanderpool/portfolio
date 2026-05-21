import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AnimatedNav from '@/components/ui/navigation-menu'
import { TransitionLink } from '@/components/transitions/TransitionLink'
import { projects } from '@/components/projects/data/projects'
import type { ProjectStatus } from '@/components/projects/data/projects'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `${project.title} — Erick Vanderpool`,
    description: project.subtitle,
  }
}

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  live:          { label: 'Live',        color: '#4A5D49', bg: '#4A5D4918' },
  'in-progress': { label: 'In Progress', color: '#B89B5E', bg: '#B89B5E18' },
  archived:      { label: 'Archived',    color: '#8A9A89', bg: '#8A9A8918' },
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project) notFound()

  const status = project.status ? STATUS_CONFIG[project.status] : null
  const stack  = project.techStack ?? project.tags

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.subtitle,
    author: { '@type': 'Person', name: 'Erick Vanderpool' },
    dateCreated: String(project.year),
    keywords: project.tags.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AnimatedNav />

      <main style={{ background: 'var(--cream-100)' }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section
          style={{
            background: 'var(--forest-900)',
            padding: 'clamp(140px, 16vw, 200px) clamp(24px, 6vw, 80px) clamp(72px, 9vw, 120px)',
          }}
        >
          {/* Back link — no event handlers, CSS opacity via Tailwind */}
          <TransitionLink
            href="/#projects"
            data-cursor="hover"
            className="font-mono uppercase tracking-[0.15em] inline-flex items-center gap-1.5 transition-opacity duration-200 hover:opacity-100"
            style={{ fontSize: '11px', color: 'var(--gold-500)', opacity: 0.6, textDecoration: 'none', display: 'inline-flex', marginBottom: '2.5rem' }}
          >
            ← Back to work
          </TransitionLink>

          {/* Meta row */}
          <div className="flex items-center flex-wrap" style={{ gap: '12px', marginBottom: '1.75rem' }}>
            {status && (
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  color: status.color,
                  background: status.bg,
                  border: `1px solid ${status.color}44`,
                  borderRadius: 999,
                  padding: '5px 14px',
                }}
              >
                {status.label}
              </span>
            )}
            <span
              className="font-mono uppercase tracking-[0.18em]"
              style={{ fontSize: '11px', color: 'var(--gold-500)' }}
            >
              {project.year} · {project.role}
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-display italic"
            style={{
              fontSize: 'clamp(52px, 8vw, 110px)',
              letterSpacing: '-0.03em',
              color: 'var(--cream-50)',
              lineHeight: 0.93,
              marginBottom: '1.75rem',
              maxWidth: '16ch',
            }}
          >
            {project.title}
          </h1>

          {/* Tagline */}
          <p
            className="font-sans"
            style={{
              fontSize: 'clamp(16px, 1.8vw, 22px)',
              color: 'var(--cream-300)',
              letterSpacing: '-0.01em',
              lineHeight: 1.5,
              maxWidth: '52ch',
            }}
          >
            {project.subtitle}
          </p>
        </section>

        {/* ── BODY ──────────────────────────────────────────────────────── */}
        <section style={{ padding: 'clamp(64px, 8vw, 112px) clamp(24px, 6vw, 80px)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.8fr) minmax(260px, 1fr)',
              gap: 'clamp(48px, 7vw, 96px)',
              alignItems: 'start',
            }}
          >

            {/* ── LEFT: narrative ─────────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>

              {/* Overview */}
              <div>
                <span
                  className="font-mono uppercase tracking-[0.2em]"
                  style={{ fontSize: '11px', color: 'var(--gold-500)', display: 'block', marginBottom: '1.5rem' }}
                >
                  Overview
                </span>
                <p
                  className="font-sans"
                  style={{ fontSize: '18px', color: 'var(--forest-600)', lineHeight: 1.8, letterSpacing: '-0.01em' }}
                >
                  {project.description ?? project.subtitle}
                </p>
              </div>

              {/* Key result callout */}
              {project.keyResult && (
                <div style={{ borderLeft: '2px solid var(--terracotta-500)', paddingLeft: '1.75rem' }}>
                  <span
                    className="font-mono uppercase tracking-[0.2em]"
                    style={{ fontSize: '11px', color: 'var(--terracotta-500)', display: 'block', marginBottom: '0.875rem' }}
                  >
                    Key result
                  </span>
                  <p
                    className="font-display italic"
                    style={{
                      fontSize: 'clamp(20px, 2.2vw, 30px)',
                      color: 'var(--forest-800)',
                      lineHeight: 1.25,
                      letterSpacing: '-0.025em',
                    }}
                  >
                    {project.keyResult}
                  </p>
                </div>
              )}

              {/* Links — pure CSS hover, no JS handlers */}
              {(project.liveUrl || project.githubUrl) && (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="hover"
                      className="font-mono uppercase transition-opacity duration-200 hover:opacity-75"
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.12em',
                        color: 'var(--cream-50)',
                        background: 'var(--terracotta-500)',
                        borderRadius: 999,
                        padding: '11px 22px',
                        textDecoration: 'none',
                      }}
                    >
                      View live →
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="hover"
                      className="font-mono uppercase transition-opacity duration-200 hover:opacity-60"
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.12em',
                        color: 'var(--forest-700)',
                        border: '1px solid var(--cream-300)',
                        borderRadius: 999,
                        padding: '11px 22px',
                        textDecoration: 'none',
                      }}
                    >
                      GitHub →
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* ── RIGHT: sidebar ──────────────────────────────────────── */}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingTop: '3.5rem' }}
            >
              {/* Tech stack */}
              <div>
                <span
                  className="font-mono uppercase tracking-[0.2em]"
                  style={{ fontSize: '11px', color: 'var(--gold-500)', display: 'block', marginBottom: '1.25rem' }}
                >
                  Built with
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {stack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono"
                      style={{
                        fontSize: '12px',
                        letterSpacing: '0.06em',
                        padding: '6px 14px',
                        border: `0.5px solid ${project.accent}4D`,
                        borderRadius: 100,
                        color: project.accent,
                        background: `${project.accent}09`,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <span
                  className="font-mono uppercase tracking-[0.2em]"
                  style={{ fontSize: '11px', color: 'var(--gold-500)', display: 'block', marginBottom: '0.625rem' }}
                >
                  Category
                </span>
                <p className="font-sans capitalize" style={{ fontSize: '15px', color: 'var(--forest-600)', letterSpacing: '-0.01em' }}>
                  {project.category}
                </p>
              </div>

              {/* Year */}
              <div>
                <span
                  className="font-mono uppercase tracking-[0.2em]"
                  style={{ fontSize: '11px', color: 'var(--gold-500)', display: 'block', marginBottom: '0.625rem' }}
                >
                  Year
                </span>
                <p className="font-sans" style={{ fontSize: '15px', color: 'var(--forest-600)', letterSpacing: '-0.01em' }}>
                  {project.year}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER NAV ────────────────────────────────────────────────── */}
        <div
          style={{
            padding: '0 clamp(24px, 6vw, 80px) clamp(72px, 9vw, 112px)',
            borderTop: '1px solid var(--cream-300)',
            paddingTop: 'clamp(48px, 6vw, 72px)',
          }}
        >
          <TransitionLink
            href="/#projects"
            data-cursor="hover"
            className="font-display italic transition-opacity duration-200 hover:opacity-70"
            style={{
              fontSize: 'clamp(22px, 2.8vw, 32px)',
              color: 'var(--terracotta-500)',
              letterSpacing: '-0.025em',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            ← All projects
          </TransitionLink>
        </div>

      </main>
    </>
  )
}
