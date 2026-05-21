'use client'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getPrefersReducedMotion } from '@/lib/motion'
import ContactModal from './ContactModal'

const ContactScene = dynamic(() => import('./ContactScene'), { ssr: false })

gsap.registerPlugin(ScrollTrigger)

const HEADLINE = ["Let’s build", 'something', 'worth reading.']

const SOCIALS = [
  { label: 'GitHub',   href: 'https://github.com/evanderpool'  },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/erick-vanderpool/' },
  // { label: 'Twitter',  href: 'https://twitter.com/...' }, // add when ready
]

export default function Contact() {
  const [modalOpen, setModalOpen] = useState(false)
  const sectionRef   = useRef<HTMLElement>(null)
  const headlineRef  = useRef<HTMLDivElement>(null)
  const subRef       = useRef<HTMLParagraphElement>(null)
  const cardsRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || getPrefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const lines = headlineRef.current!.querySelectorAll('.contact-line')
      gsap.fromTo(
        lines,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.09,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      )

      gsap.fromTo(
        [subRef.current, cardsRef.current],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 65%' },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <>
    <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full flex flex-col items-center justify-center text-center overflow-hidden"
      style={{
        background: 'var(--forest-900)',
        minHeight: '100dvh',
        padding: 'clamp(80px, 12vw, 160px) clamp(24px, 6vw, 80px)',
      }}
    >
      {/* Section label */}
      <div
        className="absolute top-10 left-[clamp(24px,6vw,80px)] font-mono uppercase tracking-[0.2em]"
        style={{ fontSize: '11px', color: 'var(--gold-500)' }}
      >
        04 / Contact
      </div>

      {/* Wireframe sphere */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden
      >
        <div className="w-full h-full">
          <ContactScene />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-10">
        {/* Headline */}
        <div ref={headlineRef}>
          {HEADLINE.map((line) => (
            <div key={line} className="overflow-hidden">
              <div
                className="contact-line font-display font-black"
                style={{
                  fontSize: 'clamp(48px, 9vw, 112px)',
                  letterSpacing: '-0.03em',
                  color: 'var(--cream-50)',
                  lineHeight: 0.95,
                }}
              >
                {line}
              </div>
            </div>
          ))}
        </div>

        {/* Sub-copy */}
        <p
          ref={subRef}
          className="font-sans max-w-md"
          style={{ fontSize: '17px', color: 'rgba(237,228,211,0.70)', letterSpacing: '-0.01em', lineHeight: 1.7 }}
        >
          Open to freelance projects, full-time roles, and creative collaborations.
        </p>

        {/* Contact CTAs — match Hero shiny-cta style */}
        <div ref={cardsRef} className="flex flex-col sm:flex-row gap-4">
          {/* Opens contact form modal */}
          <button
            onClick={() => setModalOpen(true)}
            data-cursor="hover"
            className="shiny-cta"
          >
            <span>
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden>
                <rect x="2" y="4" width="16" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Send an email
            </span>
          </button>

          {/* Calendly — update href when ready */}
          <a
            href="#"
            data-cursor="hover"
            className="shiny-cta shiny-ghost"
          >
            <span>
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden>
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Book a call
            </span>
          </a>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-8">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="font-sans relative group"
              style={{ fontSize: '13px', color: 'var(--cream-300)', letterSpacing: '-0.01em' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.color = 'var(--terracotta-400)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.color = 'var(--cream-300)'
              }}
            >
              {s.label}
              <span
                className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                style={{ background: 'var(--terracotta-500)' }}
              />
            </a>
          ))}
        </div>
      </div>

      {/* Footer strip */}
      <div
        className="absolute bottom-6 left-0 right-0 text-center font-sans"
        style={{ fontSize: '12px', color: 'var(--cream-300)', opacity: 0.5, letterSpacing: '-0.01em' }}
      >
        © 2025 Erick Vanderpool — Built with Next.js & Three.js
      </div>
    </section>
    </>
  )
}
