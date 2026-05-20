# 3D Portfolio — CLAUDE.md

> **Single source of truth** for every Claude session on this project.  
> Dev server: `npm run dev` → http://localhost:3000 (or next available port)

---

## 0. Project Status

| Phase | Status | Date |
|-------|--------|------|
| Design system (tokens, fonts, motion) | ✅ Done | — |
| Foundation (globals.css, layout, lib/) | ✅ Done | — |
| Cursor + Providers | ✅ Done | — |
| Hero (WebGL shader + dotted globe) | ✅ Done | 2026-05-20 |
| About (blob bg + skills + glass mark) | ✅ Done | 2026-05-20 |
| Projects (editorial grid + WebGL distortion) | ✅ Done | — |
| Timeline (GSAP pin + R3F spline camera) | ✅ Done | 2026-05-20 |
| Skills (orbital nodes + progress bars) | ✅ Done | — |
| Contact (wireframe sphere + glass cards) | ✅ Done | — |
| Page transition system (curtain wipe) | ✅ Done | 2026-05-20 |
| **Animated pill nav** (replaces Nav.tsx) | ✅ Done | 2026-05-20 |
| **Performance optimizations** (7 changes) | ✅ Done | 2026-05-20 |
| **shadcn/ui helpers** (button/sheet/input/label) | ✅ Done | 2026-05-20 |
| Contact form UI (structured, no backend yet) | 🔜 Next | — |
| AI Blog / Journal system | 🔜 Planned | — |
| Project data (12 real projects) | ⏳ Waiting on Erick | — |
| Project cover images | ⏳ Waiting on Erick | — |
| /work standalone page | ❓ Pending confirmation | — |
| Social links (GitHub, LinkedIn, Twitter, Calendly) | ⏸️ Todo | — |
| Fraunces typeface JSON for GlassMark | ⏸️ Todo | — |
| OG image | ⏸️ Todo | — |
| Deploy (Vercel) | ⏸️ Todo | — |

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

---

## 2. File Structure (actual)

```
portfolio/
├── app/
│   ├── globals.css          ← Tailwind v4 @theme tokens + grain + mobile grid overrides
│   ├── layout.tsx           ← Fonts (Fraunces/Inter/JetBrains), Cursor, Providers, metadata
│   └── page.tsx             ← AnimatedNav + Hero + ManifestoBlock + About + Projects +
│                               Timeline + JournalTeaser + Contact
├── components/
│   ├── Cursor.tsx           ← Canvas cursor: 8px dot + 32px lerped ring, mix-blend-mode:difference
│   ├── Nav.tsx              ← ⚠️ OLD — superseded by components/ui/navigation-menu.tsx. Kept for reference only.
│   ├── Providers.tsx        ← 'use client' wrapper that calls useLenis()
│   ├── ManifestoBlock.tsx   ← Editorial manifesto strip between Hero and About
│   ├── JournalTeaser.tsx    ← Teaser for blog — no real posts yet (AI blog system planned)
│   ├── Footer.tsx           ← Site footer (social links are placeholders)
│   ├── SectionWrapper.tsx   ← forwardRef section wrapper (available, not yet used)
│   ├── about/
│   │   ├── AboutSection.tsx     ← Orchestrator: blob bg + 2-col grid (CSS sticky left col)
│   │   ├── BlobBackground.tsx   ← Raw WebGL quad, GLSL blobs ★ NOW: IO-gated RAF
│   │   ├── AboutText.tsx        ← Framer Motion word-split headline + paragraph reveals
│   │   ├── SkillsList.tsx       ← GSAP width + counter animation on scroll inView
│   │   ├── PortraitFrame.tsx    ← White card, forest-900 interior, SVG avatar, tilt
│   │   └── GlassMark.tsx        ← R3F Text3D "EV", MeshTransmissionMaterial (ssr:false)
│   ├── timeline/
│   │   ├── data/milestones.ts       ← 5 milestones (2019–2024)
│   │   ├── TimelineSection.tsx      ← GSAP pin + progressRef + IO active gate ★ UPDATED
│   │   ├── TimelineCanvas.tsx       ← R3F Canvas — frameloop driven by `active` prop ★ UPDATED
│   │   ├── TimelineScene.tsx        ← Lights, fog, Markers, SplineCamera
│   │   ├── SplineCamera.tsx         ← CatmullRomCurve3 camera travel (copy, not lerp)
│   │   ├── Marker.tsx               ← Wireframe EdgesGeometry + vertex dots, proximity scale
│   │   ├── MilestoneCaption.tsx     ← RAF-driven MotionValue opacity/x overlay
│   │   ├── YearGhost.tsx            ← Ghost year AnimatePresence crossfade
│   │   └── MobileTimeline.tsx       ← Vertical card stack fallback (< 768px)
│   ├── projects/
│   │   ├── data/projects.ts         ← ⚠️ 12 projects — PLACEHOLDER data, real data pending from Erick
│   │   ├── hooks/useMagneticTilt.ts ← GSAP quickTo rotateX/Y
│   │   ├── context/HoverContext.tsx ← Shares hovered DOMRect between cards + WebGL canvas
│   │   ├── ProjectsHeader.tsx       ← Section label + filter pills (Framer Motion layoutId)
│   │   ├── ProjectCard.tsx          ← Card with tilt, clip-path (preserve-3d compat)
│   │   ├── ProjectGrid.tsx          ← 12-col CSS Grid, whileInView + AnimatePresence
│   │   ├── DistortionPlane.tsx      ← R3F mesh GLSL ★ NOW: drives demand frames via invalidate()
│   │   ├── ProjectCanvas.tsx        ← Fixed Canvas ★ NOW: frameloop="demand"
│   │   └── ProjectsSection.tsx      ← Orchestrator; skips WebGL on (pointer: coarse)
│   ├── sections/
│   │   ├── Hero.tsx         ← GSAP staggered headline, CTA buttons, IO-gated globe+shader
│   │   ├── HeroScene.tsx    ← OLD R3F icosahedron — superseded, kept for reference
│   │   ├── About.tsx        ← OLD — superseded by components/about/, kept for reference
│   │   ├── AboutScene.tsx   ← OLD — superseded, kept for reference
│   │   ├── Projects.tsx     ← OLD horizontal scroll — superseded, kept for reference
│   │   ├── ProjectsScene.tsx← OLD R3F gold particles — superseded, kept for reference
│   │   ├── Skills.tsx       ← Skill categories + animated progress bars (ScrollTrigger)
│   │   ├── SkillsScene.tsx  ← R3F: 9 nodes orbiting terracotta octahedron
│   │   ├── Contact.tsx      ← Dark section, glass cards, socials (links are placeholders)
│   │   └── ContactScene.tsx ← R3F: pulsing gold wireframe icosahedron
│   ├── transitions/
│   │   ├── TransitionLink.tsx   ← Custom Next.js Link wrapper — fires curtain before navigate
│   │   └── PageCurtain.tsx      ← Zustand + GSAP curtain wipe (strips, forest-900)
│   └── ui/                  ← shadcn-compatible component folder
│       ├── navigation-menu.tsx  ← ★ NEW animated pill nav (replaces Nav.tsx)
│       ├── animated-shader-hero.tsx ← pre-existing (⚠️ has 1 unrelated TS error — ignore)
│       ├── shader-background.tsx    ← Hero WebGL shader ★ NOW: IO + visibilitychange gated
│       ├── wireframe-dotted-globe.tsx ← D3 globe ★ NOW: AbortController + idleCallback
│       ├── shiny-button.tsx         ← pre-existing animated CTA button
│       ├── button.tsx               ← ★ NEW shadcn/button
│       ├── sheet.tsx                ← ★ NEW shadcn/sheet
│       ├── input.tsx                ← ★ NEW shadcn/input
│       └── label.tsx                ← ★ NEW shadcn/label
├── lib/
│   ├── utils.ts             ← cn() helper (simple joiner — no clsx/tailwind-merge needed)
│   ├── motion.ts            ← EASE_OUT, DUR_UI/HERO/CINEMATIC, STAGGER, getPrefersReducedMotion()
│   └── lenis.ts             ← useLenis(): Lenis 1.3 + GSAP ticker ★ NOW: lagSmoothing(500,33)
├── store/
│   └── transition.ts        ← Zustand store: useTransition() — start(href), isTransitioning
├── public/
│   ├── fonts/
│   │   └── fraunces.json    ← ⚠️ PLACEHOLDER (helvetiker) — replace for correct GlassMark glyphs
│   └── projects/            ← ⚠️ EMPTY — 12 cover images needed (see §8)
├── CLAUDE.md                ← this file
├── package.json
├── tsconfig.json            ← strict, @/* alias → project root
└── postcss.config.mjs       ← @tailwindcss/postcss
```

---

## 3. Nav — Animated Pill (replaced 2026-05-20)

**File:** `components/ui/navigation-menu.tsx`  
**Old file:** `components/Nav.tsx` — kept as reference, NOT imported anywhere.

### Behavior
- Starts expanded: `EV` monogram + 6 links + pulsing gold dot
- Scrolls down past 150px → collapses to 48px circle with `Menu` icon (spring physics)
- Scrolls back up 80px from collapse point → auto-expands
- Tap collapsed circle → expands (mobile menu replacement — no full-screen overlay)
- Active section: IntersectionObserver (threshold 0.3) highlights current link terracotta-500

### Key implementation details
- `useMotionValueEvent(scrollY, 'change', handler)` — Framer Motion v12 scroll driver
- Stale-closure-safe: `isCollapsedRef` kept in sync with state via `useEffect`
- `getPrefersReducedMotion()` cached in `useMemo([], [])` — not called on every render
- `data-cursor="hover"` on all interactive elements
- `TransitionLink` used for the `/work` route link
- Spring variants: `{ type: 'spring', damping: 22, stiffness: 280 }` — no `ease` prop (CLAUDE.md rule)
- `EASE_OUT` from `lib/motion.ts` used in fade variants

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

## 4. Timeline Section — Architecture Detail

### How it works
- **GSAP pin**: `TimelineSection` pins for `(milestones.length + 1) * window.innerWidth` px
- **progressRef**: `useRef({ value: 0 })` — GSAP tweens `.value` 0→1 via `scrub: 1`. Never React state.
- **Active gate**: `IntersectionObserver` (rootMargin: 200px) sets `canvasActive` state →
  `TimelineCanvas` receives `active` prop → `frameloop={active ? 'always' : 'demand'}` ★ NEW
- **ProgressContext**: exported from `TimelineCanvas.tsx`. R3F children call `useProgress()`.
- **HTML overlays**: `MilestoneCaption` and `YearGhost` receive `progressRef` directly (outside R3F tree).
- **SplineCamera**: `camera.position.copy(_pos)` — NOT lerp. Scrub:1 is the only smoothing layer.
- **Mobile**: `window.matchMedia('(max-width: 767px)')` → `<MobileTimeline>` (no canvas).

### Milestones (`data/milestones.ts`)
| Year | Title | Shape | Color |
|------|-------|-------|-------|
| 2019 | First production database | icosahedron | #C8553D |
| 2020 | Going full-stack | torus | #B89B5E |
| 2021 | Content meets code | octahedron | #D67358 |
| 2023 | Leading the stack | cylinder | #4A5D49 |
| 2024 | Building in public | dodecahedron | #B89B5E |

### Camera curve
`[-6, 0.5, 8]` → milestones at `[i*8, cameraOffset[1], cameraOffset[2]+2]` → `[(n-1)*8+6, 0.5, 2]`

---

## 5. About Section — Architecture Detail

### Layout
- Two-column grid (`3fr 2fr`), stacked on mobile
- Left: `lg:sticky lg:top-[80px] lg:self-start` — CSS sticky (NOT ScrollTrigger pin)
- **Critical**: no `overflow: hidden` on any ancestor — breaks sticky

### BlobBackground ★ NOW IO-GATED
- Raw WebGL, GLSL blobs (terracotta + gold), film grain
- `IntersectionObserver` sets `isVisible` → render loop skips `drawArrays` when off-screen
- RAF stays alive for instant resume; IO disconnected in cleanup

### Other components
- **AboutText**: word-level Fraunces italic split reveal (NOT char-level)
- **SkillsList**: GSAP `fromTo` width + counter, data-attribute selectors
- **GlassMark**: R3F Text3D "EV", MeshTransmissionMaterial — font is a placeholder

---

## 6. Performance — Visibility Gating (2026-05-20)

All 7 optimizations active. TypeScript clean (one pre-existing unrelated error in `animated-shader-hero.tsx` — ignore).

| File | Change | Impact |
|------|--------|--------|
| `lib/lenis.ts` | `lagSmoothing(500, 33)` — was `0` | Restores GSAP frame-drop recovery |
| `about/BlobBackground.tsx` | IO gates RAF | Stops 60fps GPU draw when About off-screen |
| `ui/shader-background.tsx` | IO + `visibilitychange` gates RAF | Stops Hero shader when scrolled past or tab hidden |
| `ui/wireframe-dotted-globe.tsx` | AbortController on fetch + `requestIdleCallback` for dot gen | Main thread free during Hero entrance animation |
| `projects/ProjectCanvas.tsx` | `frameloop="demand"` | Zero GPU work when no card hovered |
| `projects/DistortionPlane.tsx` | `useEffect` + `state.invalidate()` drives demand frames | Self-contained render loop — only active while hovering |
| `timeline/TimelineSection.tsx` + `TimelineCanvas.tsx` | IO `active` prop → `frameloop` | Timeline canvas idles until section near viewport |
| `ui/navigation-menu.tsx` | `useMemo` caches `getPrefersReducedMotion()` | Avoids `window.matchMedia` on every render |

### Visibility gate pattern (raw WebGL)
```ts
let isVisible = true
const io = new IntersectionObserver(([e]) => { isVisible = e.isIntersecting }, { rootMargin: '80px' })
io.observe(canvas)

const render = (ts: number) => {
  rafId = requestAnimationFrame(render)
  if (!isVisible) return  // skip draw, keep RAF alive for instant resume
  // ... draw calls ...
}
// cleanup: io.disconnect()
```

### Demand rendering pattern (R3F)
```ts
// ProjectCanvas: frameloop="demand"
// DistortionPlane: kick off frames on hover change, keep going while transitioning
useEffect(() => { invalidate() }, [hovered, invalidate])

useFrame((state) => {
  // ... animate uniforms ...
  if (stillAnimating) state.invalidate()  // request next frame only if needed
})
```

---

## 7. Design System

### Color Tokens (`globals.css` @theme + :root)

| Token | Hex | Usage |
|-------|-----|-------|
| `--cream-50` | `#FAF6EE` | Lightest surface, card frames |
| `--cream-100` / `--paper` | `#F5EFE6` | Default page background |
| `--cream-200` | `#EDE4D3` | Card surfaces |
| `--cream-300` | `#D9CDB5` | Dividers, skill track |
| `--terracotta-500` | `#C8553D` | **Primary accent — CTAs, active states, skill bars** |
| `--terracotta-400` | `#D67358` | Hover state |
| `--terracotta-600` | `#A6422F` | Pressed state |
| `--forest-900` | `#131D12` | Hero bg, Contact bg, portrait card interior |
| `--forest-800` | `#1F2E1E` | Body text in About |
| `--forest-600` | `#2D3D2C` | Primary text |
| `--forest-400` | `#4A5D49` | Secondary text, captions |
| `--gold-500` | `#B89B5E` | Section labels, skill numbers, globe accents |
| `--gold-300` | `#D4BB7D` | Wireframe sphere |
| `--ink` | `#1A1612` | Text on cream |

### Typography

| Role | Font | CSS var |
|------|------|---------|
| Display/Editorial | Fraunces (variable: opsz, SOFT, WONK) | `var(--font-display)` |
| Body/UI | Inter | `var(--font-sans)` |
| Code/Mono | JetBrains Mono | `var(--font-mono)` |

Scale: `clamp(54px, 9vw, 118px)` hero · `clamp(38px, 5.5vw, 64px)` section heads.  
Letter-spacing: `-0.03em` display · `-0.01em` body.

### Motion Constants (`lib/motion.ts`)

```ts
EASE_OUT      = [0.16, 1, 0.3, 1] as const   // ← always import this, never raw array
EASE_IN_OUT   = [0.65, 0, 0.35, 1] as const
DUR_UI        = 0.8
DUR_HERO      = 1.2
DUR_CINEMATIC = 2.5
STAGGER       = 0.07
getPrefersReducedMotion() → boolean  // window.matchMedia — cache in useRef/useMemo
```

### Section Rhythm

| Section | Background | Text |
|---------|-----------|------|
| Hero | forest-900 (dark) | cream-50 headlines, gold-500 label, cream-300 body |
| ManifestoBlock | cream-100 | forest-900 |
| About | blob canvas (cream-100 base) | forest-800/900 |
| Projects | cream-100 | forest-800 |
| Timeline | forest-900 (dark) | cream-50, gold-500 labels |
| Skills | cream-100 | forest-900 |
| Contact | forest-900 (dark) | cream-50 |

---

## 8. Architecture Patterns

### R3F Components
- `'use client'` at top of every scene/canvas file
- Imported via `dynamic(() => import('./X'), { ssr: false })`
- Canvas: `dpr={[1, 2]}` always, `gl={{ alpha: true }}`
- **Performance**: `frameloop="demand"` where possible; `frameloop="always"` only when actively animating via scrub
- Mouse tracking: `useEffect` + `window.addEventListener('mousemove', fn, { passive: true })`

### Raw WebGL (BlobBackground / ShaderBackground pattern)
```ts
const gl = canvas.getContext('webgl')
// TRIANGLE_STRIP quad: [-1,-1], [1,-1], [-1,1], [1,1]
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
// Always: IntersectionObserver gate + io.disconnect() in cleanup
```

### GSAP Usage
```ts
gsap.registerPlugin(ScrollTrigger)  // in every file that uses it

const ctx = gsap.context(() => {
  gsap.fromTo(target, { y: 40, opacity: 0 }, {
    y: 0, opacity: 1,
    scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
  })
}, sectionRef)
return () => ctx.revert()
```

### Framer Motion Patterns
```ts
// ✅ Correct
import { EASE_OUT } from '@/lib/motion'
<motion.span transition={{ duration: 0.75, ease: EASE_OUT }}>

// ❌ Wrong — number[] fails FM v12 TypeScript strict
<motion.span transition={{ ease: [0.16, 1, 0.3, 1] as number[] }}>

// ✅ Spring variants (no ease needed — avoids the type issue entirely)
const variants = {
  open: { width: 'auto', transition: { type: 'spring' as const, damping: 22, stiffness: 280 } },
  closed: { width: '3rem', transition: { type: 'spring' as const, damping: 22, stiffness: 280 } },
}

// ✅ Word-level headline split (NOT char-level — chars break mid-word)
{headline.split(' ').map((word, i) => (
  <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
    <motion.span variants={wordVariants} style={{ display: 'inline-block', marginRight: '0.28em' }}>
      {word}
    </motion.span>
  </span>
))}
```

### CSS Sticky vs ScrollTrigger Pin
- **CSS sticky** → column-level stickiness in a two-column layout: `lg:sticky lg:top-[80px] lg:self-start`
- **ScrollTrigger pin** → full-section pinning only (Timeline, horizontal scroll)
- **Never** pin individual columns with ScrollTrigger — z-index bleed + abrupt snap
- **Never** put `overflow: hidden` on any ancestor of a sticky element

### Lenis Integration (`lib/lenis.ts`)
```ts
const lenis = new Lenis({ duration: 1.1, easing: ... })
lenis.on('scroll', () => ScrollTrigger.update())
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(500, 33)  // smooth frame drops > 33ms; was 0 (broken)
requestAnimationFrame(() => ScrollTrigger.refresh())
```

### Page Transitions (`store/transition.ts` + `TransitionLink`)
- Zustand store: `useTransition()` → `{ start(href), isTransitioning }`
- `TransitionLink`: intercepts clicks → `start(href)` → 800ms curtain → `router.push(href)`
- `PageCurtain`: fixed overlay, GSAP strip animation (forest-900 strips)
- Use `TransitionLink` instead of Next.js `<Link>` for internal route navigation

### Projects WebGL Distortion
- Fixed-position Canvas (z-index 50, pointer-events none) covers full viewport
- `HoverContext` shares hovered card `DOMRect` with Canvas
- `OrthographicCamera(left=-1, right=1, top=1, bottom=-1)` maps 1:1 to NDC
- `frameloop="demand"` — DistortionPlane drives its own frames via `invalidate()`
- Card tilt: `clip-path: inset(0 round 16px)` (NOT `overflow: hidden`) — preserves `preserve-3d`

### Cursor
`data-cursor="hover"` on **every** interactive element → cursor ring scales 1.8×, inverts.

---

## 9. Installed Packages

### Dependencies (all correctly in `dependencies`, not `devDependencies`)
```json
"@radix-ui/react-dialog": "^1.1.15",
"@radix-ui/react-label": "^2.1.8",
"@radix-ui/react-slot": "^1.2.4",
"@react-three/drei": "^10.7.7",
"@react-three/fiber": "^9.6.1",
"@types/d3": "^7.4.3",
"@types/three": "^0.184.1",
"class-variance-authority": "^0.7.1",
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
### devDependencies (build tooling only — correct)
```json
"@tailwindcss/postcss": "^4",
"@types/node": "^20",
"@types/react": "^19",
"@types/react-dom": "^19",
"eslint": "^9",
"eslint-config-next": "16.2.6",
"playwright": "^1.60.0",
"tailwindcss": "^4",
"typescript": "^5"
```

---

## 10. Known Issues / Watch-outs

| Issue | Fix / Status |
|-------|-------------|
| `public/fonts/fraunces.json` is a placeholder (helvetiker) | Replace with real Fraunces JSON (facetype.js / fontsquirrel) → correct GlassMark glyphs |
| `animated-shader-hero.tsx` line 85 — pre-existing TS error | Unrelated to current work — ignore until that component is used |
| `@types/d3`, `@types/three` in `dependencies` (not devDeps) | Harmless — type packages ship with build, negligible bundle impact |
| `public/projects/*.jpg` — all 404 | Waiting on Erick for screenshots + generated images |
| Social links in `Contact.tsx` + `Footer.tsx` are placeholders | Update with real GitHub, LinkedIn, Twitter, Calendly URLs |
| Journal/Blog has no real posts | AI blog system planned — architecture TBD |
| `/work` route — unknown state | Confirm with Erick whether standalone page is wanted |
| `SplitText` (GSAP premium) not available | Word-level manual split (see §8 pattern) |
| `cn()` in `lib/utils.ts` is a simple joiner | No clsx/tailwind-merge — fine for current usage; upgrade if class-conflict bugs appear |

---

## 11. What to Build Next (priority order)

### 🔜 Ready now
1. **Contact form UI** — structured fields (name, email, company, project type dropdown, budget range dropdown, timeline, description textarea). On-brand glass cards. No backend yet — Google Sheets integration later as a Next.js Route Handler.

2. **AI Blog / Journal system** — Claude API auto-generates SEO posts. Pending decisions from Erick:
   - Cadence (daily / 2–3x week / weekly)
   - Voice (sound like Erick vs. editorial/technical)
   - Topic list (Erick to provide)
   - Cross-posting (site only vs. Medium/LinkedIn/Substack)
   - Style reference (any existing writing)
   - Pipeline: semi-auto / full-auto cron / hybrid drafts queue
   - Storage: MDX in repo / Notion API / Sanity CMS

3. **Project data** — Erick to fill in this questionnaire × 12:
   ```
   Name · Tagline · Description (2-4 sentences) · Category [Engineering/Content/Databases/Experiments]
   My role · Tech stack · Key result · Live URL · GitHub URL · Year · Status [Live/In Progress/Archived]
   Featured on homepage? [Yes/No]
   ```
   Then wire into `components/projects/data/projects.ts`.

### ⏸️ On hold (waiting on assets/decisions)
4. **Project cover images** — `public/projects/` — 12 files needed: inkwell, feedline, narrate, archon, velum, orrery, conduit, scribe, meridian, caisson, glossary, prism (all `.jpg`)
5. **Social + contact links** — real GitHub, LinkedIn, Twitter, Calendly hrefs in `Contact.tsx` + `Footer.tsx`
6. **/work page** — standalone full project listing — pending Erick's confirmation

### 🟢 Lower priority
7. Fraunces typeface JSON (`public/fonts/fraunces.json`)
8. OG image (`app/opengraph-image.tsx`)
9. Mobile polish — verify on 375px
10. Deploy — `vercel --prod` from `portfolio/` directory
12. Vercel Analytics (one import line post-deploy)

---

## 12. Design Rules (never break)

| Rule | Reason |
|------|--------|
| Fraunces only for display/headlines | Body Fraunces reads too literary; Inter keeps clarity |
| Terracotta-500 is the **only** interactive accent | Multiple accents fracture the editorial feel |
| No drop shadows on text | Grain + contrast handle depth |
| All `<Canvas>` use `alpha: true` | Blends with section bg — no hard canvas border |
| All `<Canvas>` use `dpr={[1, 2]}` (distortion overlay: `[1, 1.5]`) | Prevents blur on retina |
| `data-cursor="hover"` on every interactive element | Cursor is the site's signature micro-interaction |
| All GSAP wrapped in `gsap.context()` | Prevents memory leaks on unmount |
| All animations guarded by reduced-motion check | Accessibility |
| `clip-path: inset(0 round X)` not `overflow: hidden` on preserve-3d tilt cards | `overflow: hidden` breaks `transformStyle: preserve-3d` in Chrome |
| CSS sticky for column stickiness; ScrollTrigger pin for full-section only | Pin on columns → z-index bleed + snap |
| No `overflow: hidden` on any sticky ancestor | Creates new scroll container, breaks sticky |
| **No double-smoothing on scrub:** `camera.position.copy()` not `.lerp()` | Lerp on top of scrub:1 causes jump on scroll reversal |
| Spring variants use `type: 'spring' as const` | TypeScript strict + Framer Motion v12 requirement |
| `EASE_OUT` from `lib/motion.ts` in all non-spring transitions | Never inline `number[]` in variant ease |
| All raw WebGL loops gated by `IntersectionObserver` | GPU continues at 60fps otherwise, even when section invisible |

---

## 13. Running the Project

```bash
cd "Portfolio WEbsite 2/portfolio"
npm run dev        # → http://localhost:3000
npm run build      # must pass before deploy
```
