'use client'
import { useCallback } from 'react'
import { useMagneticTilt } from './hooks/useMagneticTilt'
import { useHover } from './context/HoverContext'
import type { Project } from './data/projects'

export function ProjectCard({ project }: { project: Project }) {
  const tiltRef = useMagneticTilt(10)
  const { setHovered } = useHover()

  const handleEnter = useCallback(() => {
    if (!tiltRef.current) return
    setHovered({
      rect: tiltRef.current.getBoundingClientRect(),
      cover: project.cover,
      accent: project.accent,
    })
  }, [project.cover, project.accent, setHovered, tiltRef])

  const handleLeave = useCallback(() => setHovered(null), [setHovered])

  return (
    <div style={{ perspective: '900px', height: '100%' }}>
      <div
        ref={tiltRef}
        data-cursor="hover"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="relative group"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          height: '100%',
          minHeight: '340px',
          borderRadius: '16px',
          background: 'var(--cream-200)',
          clipPath: 'inset(0 round 16px)',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        {/* Ghost index number */}
        <span
          aria-hidden
          className="absolute top-4 left-5 font-display pointer-events-none select-none"
          style={{
            fontSize: 64,
            fontWeight: 700,
            fontStyle: 'italic',
            opacity: 0.13,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: 'var(--forest-800)',
          }}
        >
          {project.id}
        </span>

        {/* Cover image */}
        <div
          className="w-full overflow-hidden"
          style={{
            aspectRatio: '16 / 10',
            background: `linear-gradient(135deg, var(--cream-300) 0%, ${project.accent}33 100%)`,
          }}
        >
          <img
            src={project.cover}
            alt=""
            role="presentation"
            className="w-full h-full object-cover"
            style={{ opacity: 0, transition: 'opacity 0.5s ease' }}
            loading="lazy"
            onLoad={(e) => {
              ;(e.target as HTMLImageElement).style.opacity = '1'
            }}
          />
        </div>

        {/* Content — lifted in Z for depth parallax */}
        <div
          className="p-6 flex flex-col gap-3"
          style={{ transform: 'translateZ(40px)' }}
        >
          <div
            className="font-mono uppercase"
            style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'var(--forest-400)' }}
          >
            {project.year} · {project.role}
          </div>

          <h3
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(22px, 2.4vw, 36px)',
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              color: 'var(--forest-800)',
            }}
          >
            {project.title}
          </h3>

          <p
            className="font-sans"
            style={{ fontSize: '15px', color: 'var(--forest-400)', lineHeight: 1.6 }}
          >
            {project.subtitle}
          </p>

          <div className="flex flex-wrap gap-2 mt-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  padding: '5px 12px',
                  border: `0.5px solid ${project.accent}4D`,
                  borderRadius: 100,
                  color: project.accent,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hover sheen */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 60% 30%, ${project.accent}12 0%, transparent 70%)`,
          }}
          aria-hidden
        />
      </div>
    </div>
  )
}
