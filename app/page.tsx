import AnimatedNav     from '@/components/ui/navigation-menu'
import Hero            from '@/components/sections/Hero'
import ManifestoBlock  from '@/components/ManifestoBlock'
import About           from '@/components/about/AboutSection'
import ProjectsSection from '@/components/projects/ProjectsSection'
import TimelineSection from '@/components/timeline/TimelineSection'
import JournalTeaser   from '@/components/JournalTeaser'
import Contact         from '@/components/sections/Contact'
import { getPosts }    from '@/lib/journal'

// Revalidate every 60s so newly approved posts appear on the homepage
export const revalidate = 60

export default async function Home() {
  // Fetch the 3 most recent published posts for the teaser
  const allPosts  = await getPosts()
  const latestThree = allPosts.slice(0, 3)

  return (
    <main>
      <AnimatedNav />
      <Hero />
      <ManifestoBlock />
      <About />
      <ProjectsSection limit={6} showViewAll />
      <TimelineSection />
      <JournalTeaser posts={latestThree} />
      <Contact />
    </main>
  )
}
