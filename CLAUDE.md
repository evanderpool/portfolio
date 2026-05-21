# 3D Portfolio — CLAUDE.md

> **Single source of truth** for every Claude session on this project.  
> Portfolio dev server: `npm run dev` → http://localhost:3000  
> Admin dev server: `cd ../portfolio-admin && npm run dev` → http://localhost:3001

---

## 0. Project Status

| Phase | Status | Date |
|-------|--------|------|
| Design system (tokens, fonts, motion) | ✅ Done | 2026-05-20 |
| Foundation (globals.css, layout, lib/) | ✅ Done | 2026-05-20 |
| Cursor + Providers | ✅ Done | 2026-05-20 |
| Hero (WebGL shader + dotted globe) | ✅ Done | 2026-05-20 |
| About (blob bg + skills + glass mark) | ✅ Done | 2026-05-20 |
| Projects (editorial grid + WebGL distortion) | ✅ Done | 2026-05-20 |
| Timeline (GSAP pin + R3F spline camera) | ✅ Done | 2026-05-20 |
| Skills (orbital nodes + progress bars) | ✅ Done | 2026-05-20 |
| Contact (wireframe sphere + glass cards) | ✅ Done | 2026-05-20 |
| Page transition system (curtain wipe) | ✅ Done | 2026-05-20 |
| Animated pill nav (replaces Nav.tsx) | ✅ Done | 2026-05-20 |
| Performance optimizations (7 changes) | ✅ Done | 2026-05-20 |
| shadcn/ui helpers (button/sheet/input/label) | ✅ Done | 2026-05-20 |
| Contact form modal (Radix Dialog, Supabase backend) | ✅ Done | 2026-05-20 |
| Supabase setup (client, schema, env vars) | ✅ Done | 2026-05-20 |
| Journal → Supabase (live posts, revalidate 60s) | ✅ Done | 2026-05-20 |
| Post detail markdown rendering (react-markdown) | ✅ Done | 2026-05-20 |
| Claude API generation (topic rotation, voice prompt, caching) | ✅ Done | 2026-05-20 |
| GitHub Actions daily cron (/api/generate) | ✅ Done | 2026-05-20 |
| Admin dashboard (separate app, portfolio-admin/) | ✅ Done | 2026-05-20 |
| Nav "Work" → #projects anchor | ✅ Done | 2026-05-20 |
| Project data (7 real projects) | ✅ Done | 2026-05-20 |
| **AI Blog system — full audit + sync fixes** | ✅ Done | 2026-05-21 |
| **JournalTeaser → live Supabase data** | ✅ Done | 2026-05-21 |
| **Admin generation history page** | ✅ Done | 2026-05-21 |
| **topic_prompt dedup + 36-topic bank** | ✅ Done | 2026-05-21 |
| **Social media content system — Phase 1 (DB schema)** | ✅ Done | 2026-05-21 |
| **Social media content system — Phase 2 (generation engine)** | ✅ Done | 2026-05-21 |
| **Social media content system — Phase 3 (admin UI)** | ✅ Done | 2026-05-21 |
| **Platform preview mockups (phone frames, accurate AR, carousel swipe)** | ✅ Done | 2026-05-21 |
| **Image upload to Supabase Storage (social-images bucket)** | ✅ Done | 2026-05-21 |
| **Image prompts — Midjourney/Flux style, 4-style visual director** | ✅ Done | 2026-05-21 |
| **Social hub — funnel-grouped view (accordion by blog post → stage → posts)** | ✅ Done | 2026-05-21 |
| **Manual re-trigger endpoint + History page ⟳ Social button** | ✅ Done | 2026-05-21 |
| **Social content calendar — Phase 4** | ⏸️ Todo | — |
| **Social API auto-posting (Instagram/Facebook/TikTok/YouTube)** | ⏸️ Todo — needs platform API setup | — |
| Blog topic bank → niche-aligned (20/month across 5 niches) | ⏸️ Todo | — |
| Project cover images (7 files) | ⏳ Waiting on Erick | — |
| Social links (GitHub, LinkedIn, Twitter, Calendly) | ⏸️ Todo | — |
| Fraunces typeface JSON for GlassMark | ⏸️ Todo | — |
| OG image | ⏸️ Todo | — |
| Deploy (Vercel) + GitHub Actions secrets | ⏸️ Todo | — |

---

## 1. Project Identity

| Field | Value |
|-------|-------|
| Name | Erick Vanderpool |
| Role | Full-stack engineer + content creator |
| Focus | Databases · Web dev · AI automation · Content systems |
| Email | erick.vanderpool2@outlook.com |
| Tone | Editorial, warm, authoritative |
| Framework | Next.js 16.2.6 App Router |
| React | 19.2.4 (concurrent features) |
| Language | TypeScript (strict) |
| 3D | React Three Fiber v9 + Drei v10 |
| Animation | GSAP 3.15 · Framer Motion 12 |
| Scroll | Lenis 1.3 |
| Styles | Tailwind CSS v4 (CSS-first, no tailwind.config.ts) |
| UI helpers | shadcn components (button/sheet/input/label) in `components/ui/` |
| Database | Supabase (PostgreSQL) — `posts` + `contact_submissions` tables |
| AI | Anthropic SDK (`@anthropic-ai/sdk`) — `claude-sonnet-4-6` for blog generation |

---

## 2. File Structure (actual)

```
portfolio/
├── app/
│   ├── globals.css          ← Tailwind v4 @theme tokens + grain + mobile grid overrides
│   ├── layout.tsx           ← Fonts (Fraunces/Inter/JetBrains), Cursor, Providers, metadata
│   ├── page.tsx             ★ ASYNC server component — fetches 3 latest posts, revalidate=60
│   │                           AnimatedNav + Hero + ManifestoBlock + About + Projects +
│   │                           Timeline + JournalTeaser(posts) + Contact
│   ├── about/
│   │   └── page.tsx         ★ ASYNC — fetches 3 latest posts, revalidate=60
│   ├── journal/
│   │   ├── page.tsx         ← All published posts, revalidate=60
│   │   └── [slug]/page.tsx  ← Single post page, revalidate=60
│   ├── api/
│   │   ├── contact/route.ts ← Contact form → Supabase contact_submissions
│   │   └── generate/route.ts← POST /api/generate (GitHub Actions cron entry point)
│   ├── sitemap.ts           ★ ASYNC — reads live posts from Supabase
│   └── robots.ts
├── components/
│   ├── Cursor.tsx
│   ├── Nav.tsx              ← ⚠️ OLD — superseded by ui/navigation-menu.tsx. NOT imported anywhere.
│   ├── Providers.tsx
│   ├── ManifestoBlock.tsx
│   ├── JournalTeaser.tsx    ★ UPDATED — accepts posts: JournalPost[] prop (no static import)
│   ├── Footer.tsx
│   ├── SectionWrapper.tsx
│   ├── about/               ← AboutSection, BlobBackground, AboutText, SkillsList, PortraitFrame, GlassMark
│   ├── journal/
│   │   ├── data/posts.ts    ← ⚠️ STALE — static seed data, NOT imported anywhere. Safe to delete.
│   │   ├── JournalPostList.tsx ← Used on /journal page
│   │   └── PostBody.tsx     ← react-markdown renderer with design-token styles
│   ├── timeline/            ← TimelineSection, TimelineCanvas, TimelineScene, SplineCamera,
│   │                           Marker, MilestoneCaption, YearGhost, MobileTimeline, data/milestones.ts
│   ├── projects/            ← ProjectsSection, ProjectGrid, ProjectCard, ProjectCanvas,
│   │                           DistortionPlane, ProjectsHeader, HoverContext, useMagneticTilt
│   │                           data/projects.ts ⚠️ PLACEHOLDER — real data pending from Erick
│   ├── sections/            ← Hero, Skills, SkillsScene, Contact, ContactScene
│   │                           (HeroScene/About/AboutScene/Projects/ProjectsScene = OLD, kept for ref)
│   ├── transitions/
│   │   ├── TransitionLink.tsx
│   │   └── PageCurtain.tsx
│   └── ui/
│       ├── navigation-menu.tsx  ← ★ Animated pill nav (active)
│       ├── shader-background.tsx
│       ├── wireframe-dotted-globe.tsx
│       ├── animated-shader-hero.tsx ← pre-existing (1 unrelated TS error — ignore)
│       ├── shiny-button.tsx
│       ├── button.tsx, sheet.tsx, input.tsx, label.tsx ← shadcn helpers
├── lib/
│   ├── utils.ts             ← cn() helper
│   ├── motion.ts            ← EASE_OUT, DUR_*, STAGGER, getPrefersReducedMotion()
│   ├── lenis.ts             ← useLenis() + GSAP ticker + lagSmoothing(500,33)
│   ├── supabase.ts          ← ⚠️ STALE — public anon client, NOT imported anywhere. Safe to delete.
│   ├── supabase-server.ts   ← supabaseAdmin (service-role key) — used by all server reads/writes
│   ├── journal.ts           ★ UPDATED — uses supabaseAdmin (not anon client). getPosts() + getPostBySlug()
│   └── generate-post.ts     ★ UPDATED — 36-topic bank, Supabase dedup via topic_prompt, saves topic_prompt
├── store/
│   └── transition.ts        ← Zustand: useTransition() — start(href), isTransitioning
├── supabase/
│   └── schema.sql           ★ UPDATED — added topic_prompt TEXT column to posts table
├── public/
│   ├── fonts/fraunces.json  ← ⚠️ PLACEHOLDER (helvetiker)
│   └── projects/            ← ⚠️ EMPTY — cover images needed
├── .github/workflows/
│   └── daily-post.yml       ← GitHub Actions cron (9AM UTC) → POST /api/generate
├── CLAUDE.md
├── package.json
├── tsconfig.json
└── postcss.config.mjs
```

### Admin app (`portfolio-admin/`) — separate Next.js app on port 3001

```
portfolio-admin/
├── app/
│   ├── layout.tsx
│   ├── page.tsx             ← Dashboard: draft list + GenerateButton + History/Social links
│   ├── DraftList.tsx        ← Approve / Reject → PATCH /api/posts/[slug]
│   ├── GenerateButton.tsx   ← 'use client' — calls /api/trigger-generate
│   ├── history/
│   │   ├── page.tsx         ← All posts ever generated: stats, category breakdown, topic archive
│   │   └── TriggerSocialButton.tsx ← ★ 'use client' — ⟳ Social button for published posts
│   ├── login/page.tsx
│   ├── post/[slug]/page.tsx ← Preview any post
│   ├── social/
│   │   ├── page.tsx         ★ Server — fetches pending posts + funnel metadata, exports SocialPost + FunnelMeta types
│   │   ├── SocialHub.tsx    ★ Client — funnel accordion (FunnelCard → StageSection → SocialPostCard)
│   │   │                       Platform filter pills per funnel; Content/Preview tabs per post card
│   │   ├── PlatformPreview.tsx ★ Client — phone frame mockups (TikTok 9:16, Instagram 4:5,
│   │   │                       Instagram Story/Reel 9:16, Facebook 16:9, YouTube Community 16:9,
│   │   │                       YouTube Shorts 9:16). Carousel swipe (← →). Per-slide image prompts.
│   │   └── affiliate-links/
│   │       ├── page.tsx         ← Affiliate link library server page
│   │       └── AffiliateLinkManager.tsx ← CRUD client component
│   └── api/
│       ├── auth/route.ts            ← POST — validates ADMIN_PASSWORD, sets cookie
│       ├── logout/route.ts          ← GET — clears cookie
│       ├── trigger-generate/route.ts← calls generateDraftPost() directly
│       ├── posts/[slug]/route.ts    ← PATCH (approve→fires generateSocialBatch) + DELETE
│       ├── social/
│       │   ├── [id]/route.ts        ← PATCH: approve / reject / regenerate
│       │   ├── [id]/image/route.ts  ★ POST: upload image → Supabase Storage social-images bucket
│       │   │                           DELETE: remove URL from image_urls array
│       │   └── generate/route.ts   ★ POST { slug } — manually re-trigger social generation
│       └── affiliate-links/
│           ├── route.ts             ← GET all / POST new
│           └── [id]/route.ts        ← PATCH (toggle active) / DELETE
├── lib/
│   ├── supabase-server.ts   ← supabaseAdmin (service-role key)
│   ├── generate-post.ts     ← 36-topic bank, Supabase dedup, Claude API call
│   └── generate-social.ts   ★ Generation engine: generateSocialBatch() + regenerateSocialPost()
│                               SOCIAL_SYSTEM: visual director section (4 styles: UGC/lifestyle/flat-lay/editorial)
│                               PLATFORM_AR: per-platform aspect ratio map → included in every image_prompt
│                               STAGE_MAX_TOKENS: awareness=4k, education/engagement/conversion=8k
├── middleware.ts            ← Cookie auth guard
└── .env.local               ← NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
                                ADMIN_PASSWORD, ANTHROPIC_API_KEY
```

---

## 3. AI Blog System — How It Works End-to-End

```
[Admin: click "✦ Generate post"]
  → POST /api/trigger-generate (admin app)
      → generateDraftPost() in lib/generate-post.ts
          → pickUnusedTopic(): queries Supabase for used topic_prompts, picks unused one randomly
          → Claude API: claude-sonnet-4-6, 1800 tokens, voice system prompt (cached)
          → Supabase insert: status='draft', topic_prompt saved for dedup
  → Draft appears on dashboard

[Admin: click "Approve"]
  → PATCH /api/posts/[slug] { action: 'approve' }
      → Supabase update: status='published', published_at=now()
  → Within 60s: appears on /journal + homepage JournalTeaser

[GitHub Actions: daily 9AM UTC]
  → POST /api/generate (portfolio app, requires Bearer CRON_SECRET)
      → same generateDraftPost() logic
      → saves draft to Supabase for admin review
```

### Topic bank
36 topics across 4 categories: **Databases** (9) · **AI** (9) · **Engineering** (9) · **Content** (9)  
Deduplication: `topic_prompt` column in `posts` table — used prompts are never repeated until all 36 are exhausted.

### Key rule: always use supabaseAdmin for server reads
`lib/supabase.ts` (public anon client) is stale/unused. All server-side DB access goes through `lib/supabase-server.ts` (service-role key). This is intentional — the anon key in `.env.local` is the wrong format and would silently fail.

---

## 4. Nav — Animated Pill (replaced 2026-05-20)

**File:** `components/ui/navigation-menu.tsx`  
**Old file:** `components/Nav.tsx` — kept as reference, NOT imported anywhere.

### Links
```ts
{ type: 'anchor', href: '#hero',     label: 'Home'    }
{ type: 'anchor', href: '#about',    label: 'About'   }
{ type: 'route',  href: '/work',     label: 'Work'    }  // TransitionLink
{ type: 'anchor', href: '#timeline', label: 'Journey' }
{ type: 'anchor', href: '#journal',  label: 'Journal' }
{ type: 'anchor', href: '#contact',  label: 'Contact' }
```

---

## 5. Timeline Section — Architecture Detail

- **GSAP pin**: `(milestones.length + 1) * window.innerWidth` px
- **progressRef**: `useRef({ value: 0 })` — GSAP scrub:1 tweens `.value` 0→1. Never React state.
- **Active gate**: IO (rootMargin: 200px) → `canvasActive` → `frameloop={active ? 'always' : 'demand'}`
- **SplineCamera**: `camera.position.copy(_pos)` — NOT lerp. Scrub:1 is the only smoothing layer.
- **Mobile**: `window.matchMedia('(max-width: 767px)')` → `<MobileTimeline>` (no canvas)

---

## 6. Performance — Visibility Gating (2026-05-20)

| File | Change |
|------|--------|
| `lib/lenis.ts` | `lagSmoothing(500, 33)` |
| `about/BlobBackground.tsx` | IO gates RAF |
| `ui/shader-background.tsx` | IO + `visibilitychange` gates RAF |
| `ui/wireframe-dotted-globe.tsx` | AbortController + `requestIdleCallback` |
| `projects/ProjectCanvas.tsx` | `frameloop="demand"` |
| `projects/DistortionPlane.tsx` | `state.invalidate()` drives demand frames |
| `timeline/TimelineSection.tsx` + `TimelineCanvas.tsx` | IO `active` prop → frameloop |
| `ui/navigation-menu.tsx` | `useMemo` caches `getPrefersReducedMotion()` |

---

## 7. Design System

### Color Tokens
| Token | Hex | Usage |
|-------|-----|-------|
| `--cream-50` | `#FAF6EE` | Lightest surface |
| `--cream-100` / `--paper` | `#F5EFE6` | Default page background |
| `--cream-200` | `#EDE4D3` | Card surfaces |
| `--cream-300` | `#D9CDB5` | Dividers, skill track |
| `--terracotta-500` | `#C8553D` | **Primary accent — CTAs, active states** |
| `--terracotta-400` | `#D67358` | Hover |
| `--terracotta-600` | `#A6422F` | Pressed |
| `--forest-900` | `#131D12` | Hero bg, Contact bg |
| `--forest-800` | `#1F2E1E` | Body text in About |
| `--forest-600` | `#2D3D2C` | Primary text |
| `--forest-400` | `#4A5D49` | Secondary text |
| `--gold-500` | `#B89B5E` | Section labels, skill numbers |
| `--gold-300` | `#D4BB7D` | Wireframe sphere |
| `--ink` | `#1A1612` | Text on cream |

### Typography
| Role | Font | CSS var |
|------|------|---------|
| Display/Editorial | Fraunces (variable) | `var(--font-display)` |
| Body/UI | Inter | `var(--font-sans)` |
| Code/Mono | JetBrains Mono | `var(--font-mono)` |

Scale: `clamp(54px, 9vw, 118px)` hero · `clamp(38px, 5.5vw, 64px)` section heads.

### Motion Constants (`lib/motion.ts`)
```ts
EASE_OUT      = [0.16, 1, 0.3, 1] as const
EASE_IN_OUT   = [0.65, 0, 0.35, 1] as const
DUR_UI        = 0.8
DUR_HERO      = 1.2
DUR_CINEMATIC = 2.5
STAGGER       = 0.07
```

---

## 8. Architecture Patterns

### Supabase — always use supabaseAdmin server-side
```ts
// ✅ Correct — all server components, route handlers, lib functions
import { supabaseAdmin } from '@/lib/supabase-server'

// ❌ Never use this — lib/supabase.ts is stale, anon key is wrong format
import { supabase } from '@/lib/supabase'
```

### JournalTeaser — always pass posts as props
```ts
// ✅ Correct — page.tsx fetches, teaser renders
const posts = await getPosts()
<JournalTeaser posts={posts.slice(0, 3)} />

// ❌ Wrong — component must never import static data or call getPosts() itself
```

### R3F Components
- `'use client'` at top of every scene/canvas file
- Imported via `dynamic(() => import('./X'), { ssr: false })`
- Canvas: `dpr={[1, 2]}` always, `gl={{ alpha: true }}`
- `frameloop="demand"` where possible

### GSAP Usage
```ts
gsap.registerPlugin(ScrollTrigger)
const ctx = gsap.context(() => { /* animations */ }, sectionRef)
return () => ctx.revert()
```

### Framer Motion
```ts
// ✅ Always import EASE_OUT from lib/motion
import { EASE_OUT } from '@/lib/motion'
<motion.span transition={{ duration: 0.75, ease: EASE_OUT }}>

// ✅ Spring variants
{ type: 'spring' as const, damping: 22, stiffness: 280 }
```

### Page Transitions
- `TransitionLink` instead of Next.js `<Link>` for internal route navigation
- Zustand store: `useTransition()` → `{ start(href), isTransitioning }`

---

## 9. Installed Packages

### portfolio/
```json
"@anthropic-ai/sdk": "latest",
"@radix-ui/react-dialog": "^1.1.15",
"@radix-ui/react-label": "^2.1.8",
"@radix-ui/react-slot": "^1.2.4",
"@react-three/drei": "^10.7.7",
"@react-three/fiber": "^9.6.1",
"@supabase/supabase-js": "^2.49.4",
"d3": "^7.9.0",
"framer-motion": "^12.39.0",
"gsap": "^3.15.0",
"lenis": "^1.3.23",
"lucide-react": "^1.16.0",
"next": "16.2.6",
"react": "19.2.4",
"react-dom": "19.2.4",
"three": "^0.184.0",
"zustand": "^5.0.13"
```

### portfolio-admin/
```json
"@anthropic-ai/sdk": "latest",
"@supabase/supabase-js": "^2.49.4",
"next": "16.2.6",
"react": "19.2.4",
"react-dom": "19.2.4",
"react-markdown": "^10.1.0"
```

---

## 10. Social Media Content System

### Overview
After a blog post is **approved** in the admin dashboard, a 10-day social media content funnel is automatically generated and saved to Supabase. The approval route fires `generateSocialBatch()` as a non-blocking background job.

### Funnel Structure (per blog post)
| Days | Stage | Psychological Trigger | CTA |
|------|-------|----------------------|-----|
| 1–2 | Awareness | Pattern interrupt, curiosity gap | Follow |
| 3–4 | Education | Reciprocity, authority, "aha" moment | Save / Share |
| 5–7 | Engagement | Social proof, FOMO, tribal identity | Comment / Tag |
| 8–10 | Conversion | Transformation promise, trust transfer | Buy / Affiliate link |

### Platforms
Instagram · Facebook · TikTok · YouTube

### Content Types Per Platform
- TikTok: text_post, video_script
- Instagram: image_caption, carousel, story, reel_script
- Facebook: text_post (short + long-form)
- YouTube: community_post, shorts_script

### Virality Scoring (per post)
5 dimensions: hook · value · emotion · shareability · purchase_intent
Weighted formula → score 0–10 + 2–3 sentence snippet explanation

### Niches
home · living · technology · ai · pet-supplies · general

### Affiliate Revenue Goal
- $3,000/month from affiliate links (Amazon, TikTok Shop, Facebook, Instagram)
- Following goal: 20K–40K → 100K across all platforms

### Image Prompt System
Every post gets a **Midjourney/Flux-style image_prompt** generated by Claude acting as visual director.

**4 visual styles** — deployed based on funnel stage:
- **UGC/Authentic** (AWARENESS): shot-on-iPhone energy, real-home, highest trust signal
- **Lifestyle/Aspirational** (AWARENESS): real person + benefit, "that could be me"
- **Flat-lay/Product** (EDUCATION + CONVERSION): overhead 90°/45°, product hero, styled surface
- **Bold Editorial** (ENGAGEMENT): high contrast, strong composition, scroll-stopping

**Prompt structure** (enforced): shot type → subject+setting → lighting → mood → color palette (warm neutrals/earthy) → niche detail → composition note → quality tags → `--ar X:Y`

**Platform AR flags** (auto-included via `PLATFORM_AR` map):
- Instagram feed/carousel → `--ar 4:5`
- Instagram Story/Reel, TikTok, YouTube Shorts → `--ar 9:16`
- Facebook, YouTube Community → `--ar 16:9`

Carousel slides each get their own prompt: slide 1 = bold cover, middle = educational/proof, last = CTA visual.

### Social Hub UI — Funnel-Grouped View
Posts are grouped by funnel (blog post), not by platform tab. Layout:
```
▼ ● [Blog Post Title]              niche · May 21 → May 31   18 pending
  [ All 18 ] [ Instagram 6 ] [ TikTok 5 ] [ Facebook 4 ] [ YouTube 3 ]
  ▼ AWARENESS  Days 1–2  ·  6
      Day 1 · TikTok — Text Post     [📝 Content] [📱 Preview]
      ...
  ▼ EDUCATION  Days 3–4  ·  4
  ▼ ENGAGEMENT Days 5–7  ·  5
  ▼ CONVERSION Days 8–10 ·  3
```
- Funnels sorted newest first; collapsible
- Platform filter pills per funnel (hide zero-count platforms)
- Stage sections color-coded, collapsible, show day range + count
- Each post card: Content tab (hook/caption/slides/script/virality) + Preview tab (phone mockup)

### Platform Preview Mockups
Phone frame mockups in `PlatformPreview.tsx` — accurate to platform specs:
- **TikTok** — dark 9:16, right sidebar icons, bottom overlay with handle/caption/sound
- **Instagram Feed** — light, gradient avatar ring, 4:5 image, action bar, carousel swipe
- **Instagram Story/Reel** — dark 9:16, progress bars, send message bar
- **Facebook** — light card, 16:9 image, reaction bar, actions
- **YouTube Community** — dark, 16:9 image, Subscribe button, like/reply
- **YouTube Shorts** — dark 9:16, progress bar, right actions, follow button

**Carousel swipe**: arrows inside phone + slide counter above + dot indicator. Each slide shows its own headline, body text, and image prompt.

### Image Upload
- User uploads image per post → `POST /api/social/[id]/image` → stored in Supabase Storage bucket `social-images` → public URL saved to `social_posts.image_urls[]`
- Preview tab's ImageSlot shows uploaded photo; "Change" / "Remove image" controls
- `DELETE /api/social/[id]/image` removes URL from array

### Manual Re-trigger
If generation fails (e.g. schema not migrated): **History page → ⟳ Social button** on any published post → `POST /api/social/generate { slug }` → fires `generateSocialBatch()` again.

### Key Files (admin app)
```
portfolio-admin/
├── lib/
│   └── generate-social.ts      ★ Engine: generateSocialBatch() + regenerateSocialPost()
│                                   SOCIAL_SYSTEM (cached), STAGE_CONFIG, PLATFORM_AR, STAGE_MAX_TOKENS
├── app/
│   ├── history/
│   │   └── TriggerSocialButton.tsx  ★ ⟳ Social re-trigger button
│   ├── social/
│   │   ├── page.tsx             ← Server: fetches posts + funnels, exports SocialPost + FunnelMeta types
│   │   ├── SocialHub.tsx        ← Client: FunnelCard → StageSection → SocialPostCard
│   │   ├── PlatformPreview.tsx  ← Client: phone mockups + ImageSlot + carousel swipe
│   │   └── affiliate-links/
│   │       ├── page.tsx
│   │       └── AffiliateLinkManager.tsx
│   └── api/
│       ├── social/[id]/route.ts         ← PATCH: approve / reject / regenerate
│       ├── social/[id]/image/route.ts   ← POST upload / DELETE remove
│       ├── social/generate/route.ts     ← POST { slug } re-trigger generation
│       └── affiliate-links/
│           ├── route.ts
│           └── [id]/route.ts
```

### Supabase Tables
```
topic_funnels     — one per blog post · tracks 10-day cycle · status: active/completed/paused
social_posts      — every content piece · columns: hook, caption, hashtags, cta, slide_content,
                    script, shot_list, is_personal_video, image_prompt, image_urls,
                    virality_score, virality_breakdown, virality_snippet, status, edit_request
affiliate_links   — link library · Claude auto-matches by niche + keywords
content_schedule  — calendar source of truth (powers Phase 4 calendar view)
posts.niche       — 'home'|'living'|'technology'|'ai'|'pet-supplies'|'general'
storage.buckets   — 'social-images' (public) for uploaded post images
```

### Known Issues / Fixes Applied
| Issue | Fix |
|-------|-----|
| Stages hit 4k token limit → JSON parse fail → 0 posts | Fixed: `STAGE_MAX_TOKENS` awareness=4k, others=8k |
| `image_prompt`/`image_urls` columns missing → silent insert fail | Fix: run schema migration SQL, then use ⟳ Social button |
| Generation fires on approval but is fire-and-forget (no UI feedback) | Check server console logs; use ⟳ Social to retry |

### Approval Flow
```
Admin approves blog post
  → PATCH /api/posts/[slug] { action: 'approve' }
      → post published to Supabase
      → generateSocialBatch(post) fired (non-blocking, ~60–90s)
          → 4 Claude calls (one per stage, SOCIAL_SYSTEM cached)
          → saves to topic_funnels + social_posts + content_schedule
  → Posts appear at /social grouped by funnel → stage → posts
  → Per post: Preview tab (phone mockup + image upload) | Content tab (full copy)
  → Approve / Request Edit / Reject each post

If generation fails → History page → ⟳ Social button on the published post
```

### Content Generation Cost
~$0.18 per blog post funnel · ~$4.60/month for 20 posts + 500 social pieces · Higgsfield AI videos ~$20–50/month

---

## 12. Known Issues / Watch-outs

| Issue | Fix / Status |
|-------|-------------|
| `public/fonts/fraunces.json` is a placeholder (helvetiker) | Replace with real Fraunces JSON → correct GlassMark glyphs |
| `public/projects/*.jpg` — all 404 | Waiting on Erick for screenshots |
| Social links in `Contact.tsx` + `Footer.tsx` are placeholders | Update with real GitHub, LinkedIn, Twitter, Calendly |
| `.next/` folder corrupts on Windows (OneDrive syncing) | Run `rmdir /s /q .next` then `npm run dev` to fix |
| `lib/supabase.ts` is stale — public anon client, never import it | All reads/writes use `lib/supabase-server.ts` (supabaseAdmin) |
| `components/journal/data/posts.ts` is stale — static seed data | No longer imported anywhere — safe to delete |
| `components/Nav.tsx` is stale — superseded by `ui/navigation-menu.tsx` | Not imported anywhere — kept for reference only |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` in portfolio `.env.local` is wrong format | Doesn't matter — journal reads use supabaseAdmin now |
| `animated-shader-hero.tsx` has 1 pre-existing TS error | Unrelated to project — ignore |

---

## 11. Supabase Schema — posts table

```sql
create table posts (
  id           uuid        primary key default gen_random_uuid(),
  slug         text        unique not null,
  title        text        not null,
  excerpt      text,
  content      text,
  year         int,
  reading_time int,
  tags         text[]      default '{}',
  topic_prompt text,       -- ★ added 2026-05-21: archived prompt used for generation (dedup)
  published_at timestamptz,
  status       text        not null default 'draft',  -- 'draft' | 'published' | 'rejected'
  created_at   timestamptz default now()
);
-- RLS: anyone can SELECT where status='published'; all writes via service role
```

---

## 12. What to Build Next (priority order)

### 🔜 Ready now
1. **Deploy to Vercel** — `vercel --prod` from `portfolio/` directory
   - Set all env vars in Vercel dashboard (same as `.env.local`)
   - Add GitHub secrets: `PORTFOLIO_URL` = live URL, `CRON_SECRET` = same value
   - GitHub Actions cron fires automatically each morning after deploy

2. **Project data** — fill in `components/projects/data/projects.ts` with real projects

### ⏸️ On hold
3. **Project cover images** — files at `public/projects/*.jpg`
4. **Social + contact links** — real hrefs in `Contact.tsx` + `Footer.tsx`
5. **Cross-posting (CP10)** — TikTok/Instagram/Meta clips from blog posts

### 🟢 Lower priority
6. Fraunces typeface JSON (`public/fonts/fraunces.json`)
7. OG image (`app/opengraph-image.tsx`)
8. Mobile polish — verify on 375px
9. Vercel Analytics

---

## 13. Design Rules (never break)

| Rule | Reason |
|------|--------|
| Fraunces only for display/headlines | Body Fraunces reads too literary |
| Terracotta-500 is the **only** interactive accent | Multiple accents fracture editorial feel |
| No drop shadows on text | Grain + contrast handle depth |
| All `<Canvas>` use `alpha: true` + `dpr={[1, 2]}` | Blends with bg; prevents blur on retina |
| `data-cursor="hover"` on every interactive element | Cursor is the site's signature micro-interaction |
| All GSAP wrapped in `gsap.context()` | Prevents memory leaks on unmount |
| All animations guarded by reduced-motion check | Accessibility |
| `clip-path: inset(0 round X)` not `overflow: hidden` on preserve-3d cards | `overflow: hidden` breaks `transformStyle: preserve-3d` |
| CSS sticky for column stickiness; ScrollTrigger pin for full-section only | Pin on columns → z-index bleed + snap |
| No `overflow: hidden` on any sticky ancestor | Creates new scroll container, breaks sticky |
| **No double-smoothing on scrub:** `camera.position.copy()` not `.lerp()` | Lerp on top of scrub:1 causes jump on reversal |
| `EASE_OUT` from `lib/motion.ts` in all non-spring transitions | Never inline `number[]` in variant ease |
| All raw WebGL loops gated by `IntersectionObserver` | GPU continues at 60fps otherwise |
| **Always use supabaseAdmin for server-side reads** | Anon key is wrong format — would silently return [] |
| **JournalTeaser receives posts as prop** | Component is 'use client' — cannot fetch server-side |

---

## 14. Running the Project

```cmd
:: Portfolio (Terminal 1)
cd /d "C:\Users\Erick\OneDrive\Desktop\Portfolio WEbsite 2\portfolio" && npm run dev

:: Admin (Terminal 2)
cd /d "C:\Users\Erick\OneDrive\Desktop\Portfolio WEbsite 2\portfolio-admin" && npm run dev
```

If portfolio fails with "Failed to open database" (OneDrive cache corruption):
```cmd
cd /d "C:\Users\Erick\OneDrive\Desktop\Portfolio WEbsite 2\portfolio" && rmdir /s /q .next && npm run dev
```
