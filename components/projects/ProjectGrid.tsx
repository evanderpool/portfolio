'use client'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ProjectCard } from './ProjectCard'
import type { Project } from './data/projects'

type Props = {
  projects: Project[]
  isFiltered: boolean
}

export function ProjectGrid({ projects, isFiltered }: Props) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      layout
      className="grid gap-5"
      style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}
    >
      <AnimatePresence mode="popLayout">
        {projects.map((project, i) => {
          const colStyle = isFiltered
            ? { gridColumn: `span ${Math.min(project.gridCol, 6)}` }
            : {
                gridColumn: project.gridColStart
                  ? `${project.gridColStart} / span ${project.gridCol}`
                  : `span ${project.gridCol}`,
                gridRow: project.gridRowStart ?? 'auto',
              }

          return (
            <motion.div
              key={project.id}
              layout
              initial={reduced ? false : { y: 80, opacity: 0 }}
              whileInView={reduced ? undefined : { y: 0, opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.92 }}
              viewport={{ once: true, margin: '-100px 0px' }}
              transition={{
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
                delay: reduced ? 0 : (i % 3) * 0.12,
              }}
              style={colStyle}
            >
              <ProjectCard project={project} />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </motion.div>
  )
}
