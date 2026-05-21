import AnimatedNav     from '@/components/ui/navigation-menu'
import Hero            from '@/components/sections/Hero'
import ManifestoBlock  from '@/components/ManifestoBlock'
import About           from '@/components/about/AboutSection'
import ProjectsSection from '@/components/projects/ProjectsSection'
import TimelineSection from '@/components/timeline/TimelineSection'
import JournalTeaser   from '@/components/JournalTeaser'
import Contact         from '@/components/sections/Contact'
import ErrorBoundary   from '@/components/ErrorBoundary'
import { getPosts }    from '@/lib/journal'

// Revalidate every 60s so newly approved posts appear on the homepage
export const revalidate = 60

export default async function Home() {
  // Fetch the 3 most recent published posts for the teaser
  const allPosts  = await getPosts()
  const latestThree = allPosts.slice(0, 3)

  return (
    <main>
      {/* Each section is isolated — one crash cannot take down the rest */}
      <ErrorBoundary><AnimatedNav /></ErrorBoundary>
      <ErrorBoundary><Hero /></ErrorBoundary>
      <ErrorBoundary><ManifestoBlock /></ErrorBoundary>
      <ErrorBoundary><About /></ErrorBoundary>
      <ErrorBoundary><ProjectsSection limit={6} showViewAll /></ErrorBoundary>
      <ErrorBoundary><TimelineSection /></ErrorBoundary>
      <ErrorBoundary><JournalTeaser posts={latestThree} /></ErrorBoundary>
      <ErrorBoundary><Contact /></ErrorBoundary>
    </main>
  )
}
