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
| Project data (7 real projects + cover images) | ✅ Done | 2026-05-20 |
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
| **Phased social generation (3 phases, Haiku for awareness, cron advancement)** | ✅ Done | 2026-05-21 |
| **FunnelCard client component (fixes Server Component event handler error)** | ✅ Done | 2026-05-21 |
| **Awareness token limit fix (4k → 6k, was silently failing)** | ✅ Done | 2026-05-21 |
| **DB migrations: image_prompt, video_prompt, image_urls, generation_phase cols** | ✅ Done | 2026-05-21 |
| **Version control: git init + full commits on both repos** | ✅ Done | 2026-05-21 |
| **Mobile rendering — full fix pass + polish** | ✅ Done | 2026-05-21 |
| **GitHub remotes — both repos connected + pushed** | ✅ Done | 2026-05-21 |
| **Deploy portfolio → Vercel (live)** | ✅ Done | 2026-05-21 |
| **Deploy portfolio-admin → Vercel (live, auth-gated)** | ✅ Done | 2026-05-21 |
| **Codebase audit — stale files deleted, Nav updated on sub-pages** | ✅ Done | 2026-05-21 |
| **GitHub Actions secrets** | ⏸️ On hold — do after confirming Vercel URLs are stable | — |
| **Mobile polish — sub-pages (About, Work, Contact routes)** | ⏸️ In progress | — |
| **Social content calendar — Phase 4** | ⏸️ Todo | — |
| **Social API auto-posting (Instagram/Facebook/TikTok/YouTube)** | ⏸️ Todo — needs platform API setup | — |
| Social links (Twitter, Calendly) | ⏸️ Todo — placeholders in Contact.tsx + Footer.tsx | — |
| OG image | ⏸️ Todo | — |
| Vercel Analytics | ⏸️ Todo | — |

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

## 1b. Live URLs

| App | URL |
|-----|-----|
| **Portfolio** | https://portfolio-jade-zeta-80.vercel.app |
| **Admin** | https://portfolio-admin-a1eey45ch-erickvanderpool-7130s-projects.vercel.app |
| **GitHub — portfolio** | https://github.com/evanderpool/portfolio (public) |
| **GitHub — admin** | https://github.com/evanderpool/portfolio-admin- (private) |

---

## 2. File Structure (actual)

```
portfolio/
├── app/
│   ├── globals.css          ← Tailwind v4 @theme tokens + grain + mobile overrides
│   ├── layout.tsx           ← Fonts (Fraunces/Inter/JetBrains), Cursor, Providers, metadata
│   ├── page.tsx             ★ ASYNC server component — fetches 3 latest posts, revalidate=60
│   │                           AnimatedNav + Hero + ManifestoBlock + About + Projects +
│   │                           Timeline + JournalTeaser(posts) + Contact
│   ├── about/
│   │   └── page.tsx         ★ ASYNC — AnimatedNav + AboutSection + JournalTeaser
│   ├── work/
│   │   └── page.tsx         ← AnimatedNav + WorksHero + ProjectsSection
│   ├── contact/
│   │   └── page.tsx         ← AnimatedNav + Contact
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
│   ├── ErrorBoundary.tsx    ← Class component — wraps layout shell + each section in page.tsx
│   ├── Providers.tsx
│   ├── ManifestoBlock.tsx
│   ├── JournalTeaser.tsx    ★ accepts posts: JournalPost[] prop (no static import)
│   ├── Footer.tsx
│   ├── SectionWrapper.tsx
│   ├── about/               ← AboutSection, BlobBackground, AboutText, SkillsList, PortraitFrame, GlassMark
│   ├── journal/
│   │   ├── JournalPostList.tsx ← Used on /journal page
│   │   └── PostBody.tsx     ← react-markdown renderer with design-token styles
│   ├── timeline/            ← TimelineSection, TimelineCanvas, TimelineScene, SplineCamera,
│   │                           Marker, MilestoneCaption, YearGhost, MobileTimeline, data/milestones.ts
│   ├── projects/            ← ProjectsSection, ProjectGrid, ProjectCard, ProjectCanvas,
│   │                           DistortionPlane, ProjectsHeader, WorksHero, HoverContext, useMagneticTilt
│   │                           data/projects.ts ← 7 real projects with cover images
│   ├── sections/            ← Hero, Skills, SkillsScene, Contact, ContactScene, ContactModal
│   │                           About.tsx + AboutScene.tsx (about page section)
│   │                           Projects.tsx + ProjectsScene.tsx (projects scroll section)
│   ├── transitions/
│   │   ├── TransitionLink.tsx
│   │   └── PageCurtain.tsx
│   └── ui/
│       ├── navigation-menu.tsx  ← ★ AnimatedNav — pill nav used on ALL pages
│       ├── shader-background.tsx
│       ├── wireframe-dotted-globe.tsx
│       ├── animated-shader-hero.tsx ← used by WorksHero (1 pre-existing TS error — ignore)
│       ├── shiny-button.tsx
│       ├── button.tsx, sheet.tsx, input.tsx, label.tsx ← shadcn helpers
├── lib/
│   ├── utils.ts             ← cn() helper
│   ├── motion.ts            ← EASE_OUT, DUR_*, STAGGER, getPrefersReducedMotion()
│   ├── lenis.ts             ← useLenis() + GSAP ticker + lagSmoothing(500,33)
│   ├── supabase-server.ts   ← supabaseAdmin (service-role key) — used by all server reads/writes
│   ├── journal.ts           ← uses supabaseAdmin. getPosts() + getPostBySlug()
│   └── generate-post.ts     ← 36-topic bank, Supabase dedup via topic_prompt, saves topic_prompt
├── store/
│   └── transition.ts        ← Zustand: useTransition() — start(href), isTransitioning
├── supabase/
│   └── schema.sql           ← posts table + topic_prompt column
├── public/
│   ├── fonts/fraunces.json  ← ✅ Real Fraunces variable font JSON (used by GlassMark)
│   └── projects/            ← ✅ All 7 cover images: artmgmt, research-agent, rag-builder,
│                               portfolio-3d, envera-dataops, covid-analysis, nashville-sql
├── .github/workflows/
│   ├── daily-post.yml       ← GitHub Actions cron (9AM UTC) → POST /api/generate
│   └── social-phases.yml    ← GitHub Actions cron (10AM UTC) → GET /api/cron/social-phases
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
│   │   └── TriggerSocialButton.tsx ← 'use client' — ⟳ Social re-trigger button
│   ├── login/page.tsx
│   ├── post/[slug]/page.tsx ← Preview any post
│   ├── social/
│   │   ├── page.tsx         ★ Server — fetches posts + funnel metadata
│   │   ├── SocialHub.tsx    ★ Client — FunnelCard → StageSection → SocialPostCard
│   │   ├── PlatformPreview.tsx ★ Client — phone mockups + ImageSlot + carousel swipe
│   │   └── affiliate-links/
│   │       ├── page.tsx
│   │       └── AffiliateLinkManager.tsx
│   └── api/
│       ├── auth/route.ts            ← POST — validates ADMIN_PASSWORD, sets cookie
│       ├── logout/route.ts          ← GET — clears cookie
│       ├── trigger-generate/route.ts← calls generateDraftPost() directly
│       ├── posts/[slug]/route.ts    ← PATCH (approve→fires generateSocialBatch) + DELETE
│       ├── cron/social-phases/route.ts ← GET — advances social funnel phases on schedule
│       ├── social/
│       │   ├── [id]/route.ts        ← PATCH: approve / reject / regenerate
│       │   ├── [id]/image/route.ts  ← POST upload / DELETE remove
│       │   └── generate/route.ts   ← POST { slug } re-trigger generation
│       └── affiliate-links/
│           ├── route.ts
│           └── [id]/route.ts
├── lib/
│   ├── supabase-server.ts   ← supabaseAdmin (service-role key)
│   ├── generate-post.ts     ← 36-topic bank, Supabase dedup, Claude API call
│   └── generate-social.ts   ★ Engine: generateSocialBatch() + regenerateSocialPost()
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
      → generateSocialBatch(post) fired (non-blocking, ~60–90s)
  → Within 60s: appears on /journal + homepage JournalTeaser

[GitHub Actions: daily 9AM UTC]
  → POST /api/generate (portfolio app, requires Bearer CRON_SECRET)
      → same generateDraftPost() logic
      → saves draft to Supabase for admin review
```

### Topic bank
36 topics across 4 categories: **Databases** (9) · **AI** (9) · **Engineering** (9) · **Content** (9)  
Deduplication: `topic_prompt` column in `posts` table — used prompts are never repeated until all 36 are exhausted.

---

## 4. Nav — Animated Pill

**Active file:** `components/ui/navigation-menu.tsx` — `export default function AnimatedNav()`  
**Used on:** all pages (homepage `page.tsx`, `about/page.tsx`, `work/page.tsx`, `contact/page.tsx`)  
**Old `components/Nav.tsx`** — **deleted 2026-05-21**

### Links
```ts
{ type: 'anchor', href: '#hero',     label: 'Home'    }
{ type: 'anchor', href: '#about',    label: 'About'   }
{ type: 'route',  href: '/work',     label: 'Work'    }  // TransitionLink
{ type: 'anchor', href: '#timeline', label: 'Journey' }
{ type: 'anchor', href: '#journal',  label: 'Journal' }
{ type: 'anchor', href: '#contact',  label: 'Contact' }
```

### Mobile behaviour
- `pointer: coarse` → auto-collapses to small circle (top-right, 3rem)
- Tap to expand; 6 links fit 430px in compact pill sizing

---

## 5. Timeline Section — Architecture Detail

- **GSAP pin**: `(milestones.length + 1) * window.innerWidth` px
- **progressRef**: `useRef({ value: 0 })` — GSAP scrub:1 tweens `.value` 0→1. Never React state.
- **Active gate**: IO (rootMargin: 200px) → `canvasActive` → `frameloop={active ? 'always' : 'demand'}`
- **SplineCamera**: `camera.position.copy(_pos)` — NOT lerp. Scrub:1 is the only smoothing layer.
- **Mobile**: `window.matchMedia('(max-width: 767px)')` → `return null` (desktop-only experience)
- **CSS guard**: `#timeline { display: none }` at `max-width: 767px` prevents hydration flash

---

## 6. Performance — Visibility Gating

| File | Change |
|------|--------|
| `lib/lenis.ts` | `lagSmoothing(500, 33)` · disabled on `pointer: coarse` (mobile) |
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

// ❌ lib/supabase.ts was deleted — public anon client, wrong key format
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

### Phased Generation
- **Phase 1** (on approval): awareness (Haiku) + education (Sonnet) → Days 1–4
- **Phase 2** (cron day 3): engagement (Sonnet) → Days 5–7
- **Phase 3** (cron day 6): conversion (Sonnet) → Days 8–10

Cron: GitHub Actions `social-phases.yml` → 10AM UTC daily → `GET /api/cron/social-phases`  
Full re-gen: `POST /api/social/generate { slug }` (all 3 phases at once)  
Cost: ~$0.30–0.65/funnel

### Image Prompt System
**4 visual styles** — deployed based on funnel stage:
- **UGC/Authentic** (AWARENESS): shot-on-iPhone energy, real-home
- **Lifestyle/Aspirational** (AWARENESS): real person + benefit
- **Flat-lay/Product** (EDUCATION + CONVERSION): overhead 90°/45°, product hero
- **Bold Editorial** (ENGAGEMENT): high contrast, scroll-stopping

Platform AR flags auto-included: `--ar 4:5` (Instagram feed) · `--ar 9:16` (Stories/TikTok/Shorts) · `--ar 16:9` (Facebook/YouTube)

### Supabase Tables
```
topic_funnels     — one per blog post · tracks 10-day cycle
social_posts      — every content piece · hook, caption, hashtags, cta, slide_content,
                    script, shot_list, image_prompt, image_urls, virality_score, status
affiliate_links   — link library · Claude auto-matches by niche + keywords
content_schedule  — calendar source of truth (Phase 4)
posts.niche       — 'home'|'living'|'technology'|'ai'|'pet-supplies'|'general'
storage.buckets   — 'social-images' (public)
```

### Key Admin Files
```
portfolio-admin/lib/generate-social.ts  ← Engine
portfolio-admin/app/social/SocialHub.tsx ← Funnel accordion UI
portfolio-admin/app/social/PlatformPreview.tsx ← Phone mockups
portfolio-admin/app/api/social/generate/route.ts ← Re-trigger endpoint
```

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
  topic_prompt text,       -- dedup: archived prompt used for generation
  niche        text,       -- 'home'|'living'|'technology'|'ai'|'pet-supplies'|'general'
  published_at timestamptz,
  status       text        not null default 'draft',
  created_at   timestamptz default now()
);
```

---

## 12. Known Issues / Watch-outs

| Issue | Status |
|-------|--------|
| `.next/` folder corrupts on Windows (OneDrive syncing) | Run `rmdir /s /q .next` then `npm run dev` |
| `animated-shader-hero.tsx` has 1 pre-existing TS error | Unrelated — ignore |
| Social links — Twitter, Calendly in `Contact.tsx` + `Footer.tsx` | Still `#` placeholders |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` in portfolio `.env.local` is wrong format | Doesn't matter — all reads use supabaseAdmin |
| Mobile — sub-pages (/about, /work, /contact routes) spacing not yet audited | Next mobile session |
| GitHub Actions secrets not yet set | On hold — set after Vercel URLs confirmed stable |

---

## 13. What to Build Next (priority order)

### 🔴 Immediate
1. **GitHub Actions secrets** — set `PORTFOLIO_URL`, `ADMIN_URL`, `CRON_SECRET` at  
   github.com/evanderpool/portfolio/settings/secrets/actions  
   (daily blog cron + social phases cron won't fire until this is done)

### 🟡 Next session — Mobile sub-pages
2. **Audit /about, /work, /contact routes on mobile** — AnimatedNav now used on all three;  
   check layout, spacing, and padding on 390px + 430px screens

### 🟡 Polish
3. **Social links** — add real Twitter and Calendly hrefs to `Contact.tsx` + `Footer.tsx`
4. **OG image** — `app/opengraph-image.tsx` for link previews
5. **Custom domain** — set in Vercel dashboard once you have a domain

### 🟢 Ongoing / Lower priority
6. **Social content calendar** — Phase 4 (calendar view using `content_schedule` table)
7. **Social API auto-posting** — needs Instagram/TikTok/Facebook/YouTube developer accounts
8. **Vercel Analytics** — one-line add to `layout.tsx`

---

## 14. Design Rules (never break)

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
| **AnimatedNav on every page** | `components/Nav.tsx` deleted — do not recreate it |

---

## 15. Running the Project

```cmd
:: Portfolio (Terminal 1)
cd /d "C:\Users\Erick\Desktop\Portfolio WEbsite 2\portfolio" && npm run dev

:: Admin (Terminal 2)
cd /d "C:\Users\Erick\Desktop\Portfolio WEbsite 2\portfolio-admin" && npm run dev
```

If portfolio fails with "Failed to open database" (OneDrive cache corruption):
```cmd
cd /d "C:\Users\Erick\Desktop\Portfolio WEbsite 2\portfolio" && rmdir /s /q .next && npm run dev
```

---

## 16. Mobile — Architecture & Fixes (2026-05-21)

### Restore Point
`git tag: pre-mobile-fix` → commit `f389ce6`

### Mobile Decisions

| Decision | Rationale |
|----------|-----------|
| **Lenis disabled on `pointer: coarse`** | Native scroll is better on mobile; Lenis fights OS momentum |
| **ErrorBoundary at two levels** | Outer catches shell crashes; inner per-section so one bad section doesn't hide the rest |
| **Journey/Timeline hidden on mobile** | 3D spline camera is desktop-only. CSS `display:none` + JS `return null` (CSS prevents hydration flash) |
| **Hero: `min-height: auto` on mobile** | Removes 100dvh stretch; content is compact and stacked |
| **Hero horizontal padding: `clamp(28px, 7vw, 80px)`** | 28px minimum edge buffer (was 20px) |
| **Contact: `gap-6 sm:gap-10`** | Tighter element spacing on mobile |
| **Nav auto-collapse on touch** | 6 links × gap overflows 430px; circle + tap-to-expand is cleaner |
| **`loading="eager"` on project covers** | `loading="lazy"` caused onLoad race; eager + `img.complete` check fixes it |
| **`viewport-fit: cover`** | Opts into Dynamic Island / notch safe area on iPhone 14 Pro Max |

### Key Mobile CSS (globals.css)
```css
/* Hero compact on mobile */
@media (max-width: 639px) {
  #hero, #hero .hero-content { min-height: auto !important; }
}

/* Journey hidden on mobile (CSS + JS double-guard) */
@media (max-width: 767px) {
  #timeline { display: none !important; }
}

/* Contact tighter on mobile */
@media (max-width: 639px) {
  #contact { min-height: auto !important; padding-top: 72px !important; padding-bottom: 72px !important; }
  #contact .contact-content { gap: 1.25rem !important; }
}

/* Projects grid */
@media (max-width: 767px) {
  #projects .grid > * { grid-column: 1 / -1 !important; }
}
```
