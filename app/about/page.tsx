import type { Metadata } from 'next'
import AnimatedNav   from '@/components/ui/navigation-menu'
import AboutSection  from '@/components/about/AboutSection'
import JournalTeaser from '@/components/JournalTeaser'
import { getPosts }  from '@/lib/journal'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'About',
  description: 'Full-stack engineer and content creator building databases, web experiences, and AI systems.',
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Erick Vanderpool',
  jobTitle: 'Full-Stack Engineer & Content Creator',
  url: 'https://erickvanderpool.com',
  email: 'erick.vanderpool2@outlook.com',
  sameAs: [
    'https://github.com/erickvanderpool',
    'https://linkedin.com/in/erickvanderpool',
    'https://twitter.com/erickvanderpool',
  ],
  knowsAbout: [
    'PostgreSQL', 'Next.js', 'TypeScript', 'React', 'AI Automation',
    'Content Systems', 'Database Design', 'Web Development',
  ],
}

export default async function AboutPage() {
  const allPosts    = await getPosts()
  const latestThree = allPosts.slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <main>
        <AnimatedNav />
        <AboutSection />
        <JournalTeaser posts={latestThree} />
      </main>
    </>
  )
}
