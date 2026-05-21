import type { Metadata } from 'next'
import AnimatedNav     from '@/components/ui/navigation-menu'
import ProjectsSection from '@/components/projects/ProjectsSection'
import WorksHero       from '@/components/projects/WorksHero'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected projects in web engineering, data systems, and content.',
}

export default function WorkPage() {
  return (
    <main>
      <AnimatedNav />
      <WorksHero />
      <ProjectsSection />
    </main>
  )
}
