'use client'
import { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { projects as allProjects } from './data/projects'
import { HoverProvider } from './context/HoverContext'
import { ProjectsHeader, FILTERS, type Filter } from './ProjectsHeader'
import { ProjectGrid } from './ProjectGrid'
import { TransitionLink } from '@/components/transitions/TransitionLink'

const ProjectCanvas = dynamic(() => import('./ProjectCanvas'), { ssr: false })

type Props = {
  limit?: number
  showViewAll?: boolean
}

export default function ProjectsSection({ limit, showViewAll }: Props) {
  const [activeFilter, setActiveFilter] = useState<Filter>('ALL')
  const [isMouse, setIsMouse] = useState(false)

  useEffect(() => {
    setIsMouse(window.matchMedia('(pointer: fine)').matches)
  }, [])

  const filtered = useMemo(() => {
    const base = activeFilter === 'ALL'
      ? allProjects
      : allProjects.filter((p) => p.category === (activeFilter.toLowerCase() as string))
    return limit ? base.slice(0, limit) : base
  }, [activeFilter, limit])

  const isFiltered = activeFilter !== 'ALL'

  return (
    <HoverProvider>
      {isMouse && <ProjectCanvas />}

      <section
        id="projects"
        style={{ background: 'var(--cream-100)', minHeight: '100vh' }}
        className="relative"
      >
        {/* Section label */}
        <div
          className="absolute top-0 left-0 font-mono uppercase tracking-[0.2em]"
          style={{
            fontSize: '11px',
            color: 'var(--gold-500)',
            padding: 'clamp(24px, 4vw, 40px) clamp(24px, 6vw, 80px)',
          }}
        >
          02 / Work
        </div>

        <div
          className="relative z-10"
          style={{ padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px) clamp(60px, 8vw, 120px)' }}
        >
          <ProjectsHeader
            active={activeFilter}
            onFilter={setActiveFilter}
            total={allProjects.length}
            visible={filtered.length}
            hidePills={showViewAll}
          />

          <div className="mt-14">
            <ProjectGrid projects={filtered} isFiltered={isFiltered} />
          </div>

          {showViewAll && (
            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
              <TransitionLink
                href="/work"
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
                View all work →
              </TransitionLink>
            </div>
          )}
        </div>
      </section>
    </HoverProvider>
  )
}
