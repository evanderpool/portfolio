import { NextRequest, NextResponse } from 'next/server'
import { generateDraftPost } from '@/lib/generate-post'

/**
 * POST /api/generate
 *
 * Protected endpoint — called by GitHub Actions daily cron.
 * Requires Authorization: Bearer <CRON_SECRET> header.
 */
export async function POST(req: NextRequest) {
  // ── Auth check ────────────────────────────────────────────────────────────
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    console.error('[generate] CRON_SECRET env var not set')
    return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 })
  }

  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (token !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  // ── Env guard ─────────────────────────────────────────────────────────────
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured.' }, { status: 503 })
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Supabase not configured.' }, { status: 503 })
  }

  // ── Generate ──────────────────────────────────────────────────────────────
  try {
    const result = await generateDraftPost()
    console.log(`[generate] Draft created: "${result.title}" (${result.slug})`)
    return NextResponse.json({ success: true, slug: result.slug, title: result.title })
  } catch (err) {
    console.error('[generate] Error:', err)
    return NextResponse.json({ error: 'Generation failed.' }, { status: 500 })
  }
}
