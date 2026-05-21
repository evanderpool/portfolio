'use client'
import { useState } from 'react'
import { TransitionLink } from '@/components/transitions/TransitionLink'

const QUICK_LINKS = [
  { label: 'Work',    href: '/work'    },
  { label: 'About',   href: '/about'   },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
]

const SOCIALS = [
  { label: 'GitHub',   href: 'https://github.com/evanderpool'  },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/erick-vanderpool/' },
  // { label: 'Twitter',  href: 'https://twitter.com/...' }, // add when ready
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        background: 'var(--forest-900)',
        color: 'var(--cream-100)',
        padding: 'clamp(60px, 8vw, 100px) clamp(24px, 6vw, 80px) 0',
      }}
    >
      {/* Three-column grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3"
        style={{ gap: 'clamp(2.5rem, 4vw, 5rem)' }}
      >
        {/* Col 1: Wordmark + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span
            className="font-display italic"
            style={{
              fontSize: 'clamp(24px, 3.5vw, 40px)',
              color: 'var(--cream-50)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Erick Vanderpool
          </span>
          <p
            className="font-sans"
            style={{ fontSize: '15px', color: 'var(--cream-300)', lineHeight: 1.6, maxWidth: '26ch', opacity: 0.6 }}
          >
            Editorial systems, written in code.
          </p>
        </div>

        {/* Col 2: Quick links + socials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span
              className="font-mono uppercase tracking-[0.15em]"
              style={{ fontSize: '10px', color: 'var(--gold-500)' }}
            >
              Navigation
            </span>
            {QUICK_LINKS.map((l) => (
              <TransitionLink
                key={l.href}
                href={l.href}
                data-cursor="hover"
                className="font-sans"
                style={{
                  fontSize: '14px',
                  color: 'var(--cream-300)',
                  letterSpacing: '-0.01em',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  width: 'fit-content',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--terracotta-500)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--cream-300)'
                }}
              >
                {l.label}
              </TransitionLink>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="font-sans"
                style={{
                  fontSize: '13px',
                  color: 'var(--cream-300)',
                  letterSpacing: '-0.01em',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  opacity: 0.7,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = 'var(--terracotta-400)'
                  el.style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = 'var(--cream-300)'
                  el.style.opacity = '0.7'
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Col 3: Newsletter form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span
            className="font-mono uppercase tracking-[0.15em]"
            style={{ fontSize: '10px', color: 'var(--gold-500)' }}
          >
            Quarterly Notes
          </span>
          <p
            className="font-sans"
            style={{ fontSize: '14px', color: 'var(--cream-300)', lineHeight: 1.6, maxWidth: '28ch', opacity: 0.65 }}
          >
            Quarterly notes on databases &amp; writing.
          </p>

          {submitted ? (
            <p
              className="font-sans"
              style={{ fontSize: '13px', color: 'var(--terracotta-500)', letterSpacing: '-0.01em' }}
            >
              You&apos;re on the list.
            </p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="font-sans"
                style={{
                  flex: 1,
                  minWidth: '160px',
                  padding: '10px 14px',
                  border: '1px solid rgba(245,239,230,0.15)',
                  borderRadius: '999px',
                  background: 'transparent',
                  color: 'var(--cream-100)',
                  fontSize: '13px',
                  outline: 'none',
                  letterSpacing: '-0.01em',
                }}
              />
              <button type="submit" data-cursor="hover" className="shiny-cta shiny-sm">
                <span>Subscribe</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom strip */}
      <div
        style={{
          borderTop: '1px solid rgba(245,239,230,0.08)',
          marginTop: 'clamp(40px, 6vw, 80px)',
          padding: '24px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p
          className="font-sans"
          style={{ fontSize: '12px', color: 'var(--cream-300)', opacity: 0.45, letterSpacing: '-0.01em', textAlign: 'center' }}
        >
          &copy; {year} Erick Vanderpool. Built by Erick Vanderpool. Type set in Fraunces &amp; Inter.
        </p>
      </div>
    </footer>
  )
}
