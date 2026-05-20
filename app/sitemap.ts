import type { MetadataRoute } from 'next'
import { posts } from '@/components/journal/data/posts'
import { projects } from '@/components/projects/data/projects'

const BASE = 'https://erickvanderpool.com'

function projectSlug(title: string) {
  return title.toLowerCase().replace(/\s+/g, '-')
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/work`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/about`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/journal`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.6 },
  ]

  const workRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE}/work/${projectSlug(p.title)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const journalRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/journal/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...workRoutes, ...journalRoutes]
}
