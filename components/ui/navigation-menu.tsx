'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { TransitionLink } from '@/components/transitions/TransitionLink'
import { EASE_OUT, getPrefersReducedMotion } from '@/lib/motion'

// ── Types ─────────────────────────────────────────────────────────────────────

type NavLink =
  | { type: 'anchor'; href: string; label: string }
  | { type: 'route';  href: string; label: string }

// ── Data ──────────────────────────────────────────────────────────────────────

const links: NavLink[] = [
  { type: 'anchor', href: '#hero',     label: 'Home'    },
  { type: 'anchor', href: '#about',    label: 'About'   },
  { type: 'anchor', href: '#projects', label: 'Work'    },
  { type: 'anchor', href: '#timeline', label: 'Journey' },
  { type: 'anchor', href: '#journal',  label: 'Journal' },
  { type: 'anchor', href: '#contact',  label: 'Contact' },
]

const COLLAPSE_THRESHOLD = 150 // px scrolled before collapsing
const EXPAND_SCROLL_BACK  = 80  // px scrolled back up before auto-expanding

// ── Framer Motion variants ────────────────────────────────────────────────────
// Using spring transitions (no `ease` prop) per CLAUDE.md §5 strict-mode rule

const pillVariants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: 'auto',
    transition: { type: 'spring' as const, damping: 22, stiffness: 280 },
  },
  collapsed: {
    y: 0,
    opacity: 1,
    width: '3rem',
    transition: { type: 'spring' as const, damping: 22, stiffness: 280 },
  },
}

const fadeVariants = {
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.22, ease: EASE_OUT },
  },
  hidden: {
    opacity: 0,
    scale: 0.88,
    transition: { duration: 0.18, ease: EASE_OUT },
  },
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AnimatedNav() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [tappedOpen,  setTappedOpen]  = useState(false)
  const [active,      setActive]      = useState('hero')
  const [isTouch,     setIsTouch]     = useState(false)

  // Stale-closure-safe refs for the scroll handler
  const isCollapsedRef = useRef(false)
  const collapseYRef   = useRef(0)

  const pathname    = usePathname()
  const router      = useRouter()
  const { scrollY } = useScroll()
  // Memoized once — avoids a live matchMedia call on every render
  const reduced     = useMemo(() => getPrefersReducedMotion(), [])

  // Keep ref in sync with state
  useEffect(() => { isCollapsedRef.current = isCollapsed }, [isCollapsed])

  // On touch devices: auto-collapse immediately so the pill never overflows
  // the narrow viewport. The user taps the hamburger circle to expand.
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true)
      setIsCollapsed(true)
    }
  }, [])

  // ── Scroll-driven collapse ─────────────────────────────────────────────────
  useMotionValueEvent(scrollY, 'change', (y) => {
    if (reduced) return
    if (!isCollapsedRef.current && y > COLLAPSE_THRESHOLD) {
      collapseYRef.current = y
      setIsCollapsed(true)
      setTappedOpen(false)
    } else if (isCollapsedRef.current && y < collapseYRef.current - EXPAND_SCROLL_BACK) {
      setIsCollapsed(false)
      setTappedOpen(false)
    }
  })

  // ── Active section tracking (IntersectionObserver) ────────────────────────
  useEffect(() => {
    const anchorLinks = links.filter((l) => l.type === 'anchor')
    const sections    = anchorLinks.map((l) => document.querySelector(l.href))
    const observer    = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { threshold: 0.3 }
    )
    sections.forEach((s) => s && observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // ── Anchor scroll + cross-page fallback ───────────────────────────────────
  const scrollTo = (href: string) => {
    setTappedOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else if (pathname !== '/') {
      router.push(`/${href}`)
    }
  }

  const isActive   = (l: NavLink) => l.type === 'anchor' ? active === l.href.slice(1) : false
  const showFull   = !isCollapsed || reduced            // pill expanded (initial + auto-expand)
  const showCircle = isCollapsed && !tappedOpen && !reduced  // collapsed Menu circle

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4"
      style={{ pointerEvents: 'none' }}
    >
      <motion.div
        variants={pillVariants}
        animate={showFull || tappedOpen ? 'expanded' : 'collapsed'}
        initial={{ y: -80, opacity: 0 }}
        style={{
          height: '3rem',
          borderRadius: '9999px',
          background: 'rgba(245,239,230,0.82)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(200,85,61,0.12)',
          boxShadow: '0 4px 24px rgba(26,22,18,0.08)',
          pointerEvents: 'auto',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* ── Collapsed circle: Menu icon tap target ── */}
        <AnimatePresence>
          {showCircle && (
            <motion.button
              key="circle-btn"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setTappedOpen(true)}
              aria-label="Open navigation"
              data-cursor="hover"
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--terracotta-500)',
                background: 'none',
                border: 'none',
                cursor: 'none',
              }}
            >
              <Menu size={20} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Expanded pill: EV monogram + links + gold dot ── */}
        <AnimatePresence>
          {(showFull || tappedOpen) && (
            <motion.div
              key="expanded-content"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: isTouch ? '0.5rem' : '2rem',
                padding: isTouch ? '0 0.75rem' : '0 1.5rem',
                whiteSpace: 'nowrap',
              }}
            >
              {/* EV Monogram */}
              <TransitionLink
                href="/"
                data-cursor="hover"
                className={cn(
                  'font-display italic leading-none select-none flex-shrink-0',
                  isTouch ? 'text-base' : 'text-xl'
                )}
                style={{ color: 'var(--terracotta-500)', textDecoration: 'none' }}
                onClick={() => setTappedOpen(false)}
              >
                EV
              </TransitionLink>

              {/* Nav links */}
              <ul
                className={cn('flex items-center', isTouch ? 'gap-2' : 'gap-6 sm:gap-8')}
                style={{ listStyle: 'none', margin: 0, padding: 0 }}
              >
                {links.map((l) => {
                  const active_ = isActive(l)
                  const sharedClass = cn(
                    'font-sans tracking-tight transition-colors duration-200 relative group',
                    isTouch ? 'text-xs' : 'text-sm',
                    'bg-transparent border-none p-0'
                  )
                  const linkStyle: React.CSSProperties = {
                    color: active_ ? 'var(--terracotta-500)' : 'var(--forest-600)',
                    cursor: 'none',
                    textDecoration: 'none',
                  }
                  const underline = (
                    <span
                      className={cn(
                        'absolute -bottom-0.5 left-0 h-px transition-all duration-300',
                        active_ ? 'w-full' : 'w-0 group-hover:w-full'
                      )}
                      style={{ background: 'var(--terracotta-500)' }}
                    />
                  )
                  return (
                    <li key={l.href}>
                      {l.type === 'route' ? (
                        <TransitionLink
                          href={l.href}
                          data-cursor="hover"
                          className={sharedClass}
                          style={linkStyle}
                          onClick={() => setTappedOpen(false)}
                        >
                          {l.label}
                          {underline}
                        </TransitionLink>
                      ) : (
                        <button
                          onClick={() => scrollTo(l.href)}
                          data-cursor="hover"
                          className={sharedClass}
                          style={linkStyle}
                        >
                          {l.label}
                          {underline}
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>

              {/* Pulsing gold dot — decorative, desktop only */}
              <span
                className="rounded-full flex-shrink-0 hidden sm:block"
                style={{
                  width: '8px',
                  height: '8px',
                  background: 'var(--gold-500)',
                  animation: 'goldPulse 2.4s ease-in-out infinite',
                }}
                aria-hidden="true"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* goldPulse keyframe — same pattern as Nav.tsx */}
      <style>{`
        @keyframes goldPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
      `}</style>
    </div>
  )
}
