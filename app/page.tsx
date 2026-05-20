import AnimatedNav     from '@/components/ui/navigation-menu'
import Hero            from '@/components/sections/Hero'
import ManifestoBlock  from '@/components/ManifestoBlock'
import About           from '@/components/about/AboutSection'
import ProjectsSection from '@/components/projects/ProjectsSection'
import TimelineSection from '@/components/timeline/TimelineSection'
import JournalTeaser   from '@/components/JournalTeaser'
import Contact         from '@/components/sections/Contact'

export default function Home() {
  return (
    <main>
      <AnimatedNav />
      <Hero />
      <ManifestoBlock />
      <About />
      <ProjectsSection limit={6} showViewAll />
      <TimelineSection />
      <JournalTeaser />
      <Contact />
    </main>
  )
}
