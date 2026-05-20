'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { TransitionLink } from '@/components/transitions/TransitionLink'

type NavLink =
  | { type: 'anchor'; href: string; label: string }
  | { type: 'route';  href: string; label: string }

const links: NavLink[] = [
  { type: 'anchor', href: '#hero',      label: 'Home'    },
  { type: 'anchor', href: '#about',     label: 'About'   },
  { type: 'route',  href: '/work',      label: 'Work'    },
  { type: 'anchor', href: '#timeline',  label: 'Journey' },
  { type: 'anchor', href: '#journal',   label: 'Journal' },
  { type: 'anchor', href: '#contact',   label: 'Contact' },
]

export default function Nav() {
  const [visible,  setVisible]  = useState(true)
  const [active,   setActive]   = useState('hero')
  const [menuOpen, setMenuOpen] = useState(false)
  const lastY  = useRef(0)
  const router   = useRouter()
  const pathname = usePathname()

  // Sync initial visibility with actual scroll position on mount
  useEffect(() => {
    lastY.current = window.scrollY
    setVisible(window.scrollY <= 80)
  }, [])

  // Hide on scroll down, show on scroll up or near top
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setVisible(y <= 80 || y < lastY.current)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section tracking — threshold 0.3 so large sections like Contact
  // register before they fully fill the viewport
  useEffect(() => {
    const anchorLinks = links.filter((l) => l.type === 'anchor')
    const sections = anchorLinks.map((l) => document.querySelector(l.href))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { threshold: 0.3 }
    )
    sections.forEach((s) => s && observer.observe(s))
    return () => observer.disconnect()
  }, [])

  /**
   * Smooth-scroll to an anchor section.
   * If the section isn't on the current page (e.g. clicking Contact while
   * on /work), navigate home first — the browser hash will jump the page
   * after load.
   */
  const scrollTo = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else if (pathname !== '/') {
      // Navigate home with hash — browser resolves the anchor after load
      router.push(`/${href}`)
    }
  }

  const isActive = (l: NavLink) =>
    l.type === 'anchor' ? active === l.href.slice(1) : false

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          visible
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0'
        )}
      >
        <div
          className="mx-4 mt-4 rounded-full px-6 py-3 flex items-center justify-between"
          style={{
            background: 'rgba(245,239,230,0.82)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(200,85,61,0.12)',
          }}
        >
          {/* Monogram */}
          <TransitionLink
            href="/"
            data-cursor="hover"
            className="font-display italic text-xl leading-none select-none"
            style={{ color: 'var(--terracotta-500)', textDecoration: 'none' }}
          >
            EV
          </TransitionLink>

          {/* Desktop links */}
          <ul className="hidden sm:flex items-center gap-8">
            {links.map((l) => {
              const active_ = isActive(l)
              const sharedClass = cn(
                'font-sans text-sm tracking-tight transition-colors duration-200 relative group',
                active_ ? 'text-terracotta-500' : 'text-forest-600 hover:text-ink'
              )
              const underline = (
                <span
                  className={cn(
                    'absolute -bottom-0.5 left-0 h-px bg-terracotta-500 transition-all duration-300',
                    active_ ? 'w-full' : 'w-0 group-hover:w-full'
                  )}
                />
              )
              return (
                <li key={l.href}>
                  {l.type === 'route' ? (
                    <TransitionLink
                      href={l.href}
                      data-cursor="hover"
                      className={sharedClass}
                    >
                      {l.label}
                      {underline}
                    </TransitionLink>
                  ) : (
                    <button
                      onClick={() => scrollTo(l.href)}
                      data-cursor="hover"
                      className={sharedClass}
                    >
                      {l.label}
                      {underline}
                    </button>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Right: gold dot indicator + hamburger */}
          <div className="flex items-center gap-3">
            {/* Decorative animated gold dot */}
            <span
              className="hidden sm:block rounded-full"
              style={{
                width: '8px',
                height: '8px',
                background: 'var(--gold-500)',
                animation: 'goldPulse 2.4s ease-in-out infinite',
              }}
              aria-hidden="true"
            />

            {/* Mobile hamburger */}
            <button
              className="sm:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen((o) => !o)}
              data-cursor="hover"
              aria-label="Toggle menu"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block w-5 h-px bg-forest-600 transition-all duration-300"
                  style={{
                    transformOrigin: 'center',
                    transform:
                      menuOpen && i === 0
                        ? 'translateY(5px) rotate(45deg)'
                        : menuOpen && i === 1
                        ? 'scaleX(0)'
                        : menuOpen && i === 2
                        ? 'translateY(-5px) rotate(-45deg)'
                        : 'none',
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </nav>

      {/* Gold dot keyframes — injected once */}
      <style>{`
        @keyframes goldPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
      `}</style>

      {/* Mobile full-screen menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 flex flex-col items-center justify-center sm:hidden transition-all duration-500',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ background: 'var(--forest-900)' }}
      >
        <ul className="flex flex-col items-center gap-10">
          {links.map((l) => (
            <li key={l.href}>
              {l.type === 'route' ? (
                <TransitionLink
                  href={l.href}
                  className="font-display text-5xl italic leading-none"
                  style={{ color: 'var(--cream-100)', textDecoration: 'none' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </TransitionLink>
              ) : (
                <button
                  onClick={() => scrollTo(l.href)}
                  className="font-display text-5xl italic leading-none"
                  style={{ color: 'var(--cream-100)' }}
                >
                  {l.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
