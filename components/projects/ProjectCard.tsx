'use client'
import { motion } from 'framer-motion'
import { TransitionLink } from '@/components/transitions/TransitionLink'
import { EASE_OUT } from '@/lib/motion'
import type { Project } from './data/projects'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <TransitionLink
      href={`/work/${project.slug}`}
      data-cursor="hover"
      style={{ display: 'block', height: '100%', textDecoration: 'none' }}
    >
      <motion.div
        className="relative group"
        whileHover={{
          scale: 1.03,
          boxShadow: '0 24px 64px rgba(19, 29, 18, 0.13)',
        }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        style={{
          height: '100%',
          minHeight: '340px',
          borderRadius: '16px',
          /* clipPath instead of overflow:hidden — preserves scroll/stacking compat */
          clipPath: 'inset(0 round 16px)',
          background: 'var(--cream-200)',
          willChange: 'transform',
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
            zIndex: 1,
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

        {/* Content */}
        <div className="p-6 flex flex-col gap-3">
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

        {/* Hover sheen — CSS group-hover, zero JS */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 60% 30%, ${project.accent}14 0%, transparent 70%)`,
          }}
          aria-hidden
        />
      </motion.div>
    </TransitionLink>
  )
}
