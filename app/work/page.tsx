import type { Metadata } from 'next'
import Nav             from '@/components/Nav'
import ProjectsSection from '@/components/projects/ProjectsSection'
import WorksHero       from '@/components/projects/WorksHero'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected projects in web engineering, data systems, and content.',
}

export default function WorkPage() {
  return (
    <main>
      <Nav />
      <WorksHero />
      <ProjectsSection />
    </main>
  )
}
