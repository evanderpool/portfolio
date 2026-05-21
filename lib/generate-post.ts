import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from './supabase-server'

// ── Topic bank (categorised, 36 topics across 4 pillars) ─────────────────────
const TOPICS: { prompt: string; category: string }[] = [
  // ── Databases & Data ──────────────────────────────────────────────────────
  { prompt: 'How I think about Postgres schema design as a contract with future-you', category: 'Databases' },
  { prompt: 'When to reach for a relational database vs. document store — the real trade-offs', category: 'Databases' },
  { prompt: 'Database indexing explained without the textbook jargon', category: 'Databases' },
  { prompt: 'The misunderstood power of Postgres row-level security', category: 'Databases' },
  { prompt: 'Why I stopped using ORMs for anything complex', category: 'Databases' },
  { prompt: 'How to design a multi-tenant database schema that won\'t haunt you', category: 'Databases' },
  { prompt: 'Soft deletes, audit logs, and the records that matter', category: 'Databases' },
  { prompt: 'What Supabase gets right that most BaaS products miss', category: 'Databases' },
  { prompt: 'The data model is the product — how schema decisions shape features', category: 'Databases' },

  // ── AI & Automation ───────────────────────────────────────────────────────
  { prompt: 'AI automation patterns that will still matter in five years', category: 'AI' },
  { prompt: 'Automation traps: the workflows I built and then deleted', category: 'AI' },
  { prompt: 'How I actually use Claude in my daily engineering workflow', category: 'AI' },
  { prompt: 'Prompt engineering isn\'t magic — it\'s just clear writing', category: 'AI' },
  { prompt: 'Building AI-powered content pipelines that stay on-brand', category: 'AI' },
  { prompt: 'Where AI tools genuinely save time vs. where they waste it', category: 'AI' },
  { prompt: 'The RAG pattern: when retrieval beats a bigger context window', category: 'AI' },
  { prompt: 'Why most AI demos fail at scale and what to do about it', category: 'AI' },
  { prompt: 'Using structured outputs from LLMs to feed real databases', category: 'AI' },

  // ── Web Development & Engineering ────────────────────────────────────────
  { prompt: 'Why your API design is a UX problem', category: 'Engineering' },
  { prompt: 'The boring parts of web performance that actually move the needle', category: 'Engineering' },
  { prompt: 'Full-stack engineers vs. specialists — what I actually think', category: 'Engineering' },
  { prompt: 'What "engineering taste" means to me and how I developed mine', category: 'Engineering' },
  { prompt: 'React server components one year in — what changed in my mental model', category: 'Engineering' },
  { prompt: 'How I approach code review: what I look for beyond the obvious', category: 'Engineering' },
  { prompt: 'The underrated skill: reading a codebase you didn\'t write', category: 'Engineering' },
  { prompt: 'Why I default to boring technology for 80% of decisions', category: 'Engineering' },
  { prompt: 'Typed end-to-end: how TypeScript across the stack changes the game', category: 'Engineering' },

  // ── Content & Building in Public ─────────────────────────────────────────
  { prompt: 'The content system problem: why most CMSs are really database problems in disguise', category: 'Content' },
  { prompt: 'How I structure long-form content before I write a single word', category: 'Content' },
  { prompt: 'Building in public: what I\'ve learned shipping side projects', category: 'Content' },
  { prompt: 'The engineer\'s guide to writing that people actually read', category: 'Content' },
  { prompt: 'Why technical writing is the most undervalued engineering skill', category: 'Content' },
  { prompt: 'How I turned a side project into a content system that runs itself', category: 'Content' },
  { prompt: 'Documenting as you build: the habit that makes future-you grateful', category: 'Content' },
  { prompt: 'Distribution beats creation: getting your technical writing seen', category: 'Content' },
  { prompt: 'The newsletter flywheel: how consistent writing compounds over time', category: 'Content' },
]

// ── Voice system prompt ───────────────────────────────────────────────────────
const VOICE_SYSTEM = `You are Erick Vanderpool — a senior full-stack engineer and editorial writer.

Your writing style:
- First person, direct, and specific. No throat-clearing intros.
- Strong opening sentence that makes the reader want to continue.
- Use concrete examples drawn from real engineering work.
- Comfortable with nuance — you don't pretend things are simpler than they are.
- Warm but not casual. Smart but not academic.
- Never use filler phrases like "In today's world", "It's important to note", or "Let's dive in".

Post structure (600–900 words):
1. **Lede** — one punchy paragraph that earns the reader's attention
2. **Three key points** — each with a subheading (## heading), a clear argument, and a specific example
3. **Close** — a short paragraph that leaves the reader with something actionable or worth sitting with

Output format: valid Markdown only. No YAML frontmatter. No introductory commentary. Start directly with the post title as # H1, then the first paragraph.`

// ── Slug generator ────────────────────────────────────────────────────────────
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
}

// ── Extractor helpers ─────────────────────────────────────────────────────────

function extractTitle(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : 'Untitled Draft'
}

function extractExcerpt(markdown: string): string {
  const lines = markdown.split('\n').filter((l) => l.trim() && !l.startsWith('#'))
  return lines[0]?.trim().slice(0, 200) ?? ''
}

function estimateReadingTime(markdown: string): number {
  const words = markdown.split(/\s+/).length
  return Math.max(4, Math.round(words / 200))
}

// ── Smart topic picker ────────────────────────────────────────────────────────
async function pickUnusedTopic(): Promise<{ prompt: string; category: string }> {
  const { data } = await supabaseAdmin
    .from('posts')
    .select('topic_prompt')
    .not('topic_prompt', 'is', null)

  const usedPrompts = new Set((data ?? []).map((r) => r.topic_prompt as string))

  const unused = TOPICS.filter((t) => !usedPrompts.has(t.prompt))
  if (unused.length > 0) {
    return unused[Math.floor(Math.random() * unused.length)]
  }

  // All topics exhausted — recycle the oldest one
  const { data: ordered } = await supabaseAdmin
    .from('posts')
    .select('topic_prompt, created_at')
    .not('topic_prompt', 'is', null)
    .order('created_at', { ascending: true })
    .limit(1)

  const oldest = ordered?.[0]?.topic_prompt as string | undefined
  return TOPICS.find((t) => t.prompt === oldest) ?? TOPICS[0]
}

// ── Main generation function ──────────────────────────────────────────────────

export interface GenerateResult {
  slug: string
  title: string
  topic: string
  category: string
}

export async function generateDraftPost(): Promise<GenerateResult> {
  const topic = await pickUnusedTopic()

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1800,
    system: [
      {
        type: 'text',
        text: VOICE_SYSTEM,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: `Write a blog post on this topic: "${topic.prompt}"

Remember: output Markdown only, starting directly with the post title as # H1 followed immediately by the first paragraph. No preamble.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type from Claude')

  const markdown   = content.text
  const title      = extractTitle(markdown)
  const excerpt    = extractExcerpt(markdown)
  const slug       = toSlug(title)
  const readingTime = estimateReadingTime(markdown)
  const year       = new Date().getFullYear()

  const insertPayload = {
    slug,
    title,
    excerpt,
    content:      markdown,
    year,
    reading_time: readingTime,
    tags:         [topic.category],
    topic_prompt: topic.prompt,
    published_at: null,
    status:       'draft',
  }

  const { error } = await supabaseAdmin.from('posts').insert(insertPayload)

  if (error) {
    if (error.code === '23505') {
      const uniqueSlug = `${slug}-${Date.now()}`
      const retry = await supabaseAdmin
        .from('posts')
        .insert({ ...insertPayload, slug: uniqueSlug })
      if (retry.error) throw retry.error
      return { slug: uniqueSlug, title, topic: topic.prompt, category: topic.category }
    }
    throw error
  }

  return { slug, title, topic: topic.prompt, category: topic.category }
}
