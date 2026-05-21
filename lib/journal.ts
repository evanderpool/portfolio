// NOTE: Uses supabaseAdmin (service-role key) so reads always work server-side.
// The public anon key is only needed for client-side usage — all journal reads
// happen in server components, so the service-role key is correct here.
import { supabaseAdmin } from './supabase-server'

// ── Types ─────────────────────────────────────────────────────────────────────

export type JournalPost = {
  slug: string
  title: string
  excerpt: string
  year: number
  readingTime: number
  tags: string[]
  publishedAt: string
  content?: string          // full markdown body — present on detail page
}

// ── Supabase row → JournalPost mapper ─────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPost(row: any): JournalPost {
  return {
    slug:        row.slug,
    title:       row.title,
    excerpt:     row.excerpt ?? '',
    year:        row.year ?? new Date(row.published_at).getFullYear(),
    readingTime: row.reading_time ?? 5,
    tags:        row.tags ?? [],
    publishedAt: row.published_at,
    content:     row.content ?? undefined,
  }
}

// ── Data access ───────────────────────────────────────────────────────────────

/**
 * Fetch all published posts, newest first.
 * Falls back to empty array on error.
 */
export async function getPosts(): Promise<JournalPost[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []

  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('slug, title, excerpt, year, reading_time, tags, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('[journal] getPosts error:', error.message)
    return []
  }

  return (data ?? []).map(rowToPost)
}

/**
 * Fetch a single published post by slug, including full content.
 * Returns null if not found or on error.
 */
export async function getPostBySlug(slug: string): Promise<JournalPost | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null

  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('slug, title, excerpt, year, reading_time, tags, published_at, content')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) return null

  return rowToPost(data)
}
