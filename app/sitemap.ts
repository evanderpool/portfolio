import type { MetadataRoute } from 'next'
import { getPosts }           from '@/lib/journal'
import { projects }           from '@/components/projects/data/projects'

const BASE = 'https://erickvanderpool.com'

function projectSlug(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/work`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/about`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/journal`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.6 },
  ]

  const workRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE}/work/${p.title.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Live posts from Supabase — auto-includes every newly published post
  const livePosts = await getPosts()
  const journalRoutes: MetadataRoute.Sitemap = livePosts.map((p) => ({
    url: `${BASE}/journal/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...workRoutes, ...journalRoutes]
}
