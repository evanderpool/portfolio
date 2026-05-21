'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { EASE_OUT } from '@/lib/motion'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

type View = 'form' | 'success'

const PROJECT_TYPES = ['Freelance', 'Full-time', 'Collaboration', 'Other'] as const

// ── Styles ────────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(237, 228, 211, 0.06)',
  border: '1px solid rgba(237, 228, 211, 0.15)',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '15px',
  color: 'var(--cream-50)',
  fontFamily: 'var(--font-sans)',
  letterSpacing: '-0.01em',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label
        className="font-sans"
        style={{ fontSize: '12px', color: 'var(--cream-300)', letterSpacing: '-0.01em' }}
      >
        {label}
        {required && (
          <span style={{ color: 'var(--terracotta-500)', marginLeft: '3px' }}>*</span>
        )}
      </label>
      {children}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [view, setView] = useState<View>('form')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    projectType: 'Freelance',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }

      setView('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
      // Reset state after close animation completes
      setTimeout(() => {
        setView('form')
        setForm({ name: '', email: '', projectType: 'Freelance', message: '' })
        setError(null)
      }, 300)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(19, 29, 18, 0.88)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 100,
          }}
        />

        {/* Panel */}
        <Dialog.Content
          aria-describedby={undefined}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 101,
            width: 'min(560px, calc(100vw - 48px))',
            maxHeight: 'calc(100dvh - 48px)',
            overflowY: 'auto',
            background: 'var(--forest-900)',
            border: '1px solid rgba(237, 228, 211, 0.12)',
            borderRadius: '16px',
            padding: 'clamp(28px, 5vw, 48px)',
            outline: 'none',
          }}
        >
          {/* Close button */}
          <Dialog.Close asChild>
            <button
              data-cursor="hover"
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                color: 'var(--cream-300)',
                cursor: 'none',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.55,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.55')}
            >
              <X size={18} />
            </button>
          </Dialog.Close>

          {/* ── Views ── */}
          <AnimatePresence mode="wait">
            {view === 'form' ? (
              <motion.div
                key="form-view"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: EASE_OUT }}
              >
                {/* Eyebrow */}
                <p
                  className="font-mono uppercase tracking-[0.2em]"
                  style={{ fontSize: '11px', color: 'var(--gold-500)', marginBottom: '0.875rem' }}
                >
                  Send a message
                </p>

                {/* Title */}
                <Dialog.Title
                  className="font-display italic"
                  style={{
                    fontSize: 'clamp(26px, 4vw, 36px)',
                    letterSpacing: '-0.03em',
                    color: 'var(--cream-50)',
                    lineHeight: 1.05,
                    marginBottom: '2rem',
                  }}
                >
                  Tell me about your project
                </Dialog.Title>

                <form
                  onSubmit={handleSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}
                >
                  {/* Name + Email */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '1rem',
                    }}
                  >
                    <Field label="Name" required>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        style={inputStyle}
                        onFocus={(e) =>
                          ((e.currentTarget as HTMLElement).style.borderColor =
                            'var(--terracotta-500)')
                        }
                        onBlur={(e) =>
                          ((e.currentTarget as HTMLElement).style.borderColor =
                            'rgba(237,228,211,0.15)')
                        }
                      />
                    </Field>

                    <Field label="Email" required>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        style={inputStyle}
                        onFocus={(e) =>
                          ((e.currentTarget as HTMLElement).style.borderColor =
                            'var(--terracotta-500)')
                        }
                        onBlur={(e) =>
                          ((e.currentTarget as HTMLElement).style.borderColor =
                            'rgba(237,228,211,0.15)')
                        }
                      />
                    </Field>
                  </div>

                  {/* Project type */}
                  <Field label="Type of project">
                    <select
                      value={form.projectType}
                      onChange={(e) => setForm((f) => ({ ...f, projectType: e.target.value }))}
                      data-cursor="hover"
                      style={{ ...inputStyle, appearance: 'none', cursor: 'none' }}
                      onFocus={(e) =>
                        ((e.currentTarget as HTMLElement).style.borderColor =
                          'var(--terracotta-500)')
                      }
                      onBlur={(e) =>
                        ((e.currentTarget as HTMLElement).style.borderColor =
                          'rgba(237,228,211,0.15)')
                      }
                    >
                      {PROJECT_TYPES.map((t) => (
                        <option
                          key={t}
                          value={t}
                          style={{ background: 'var(--forest-900)', color: 'var(--cream-50)' }}
                        >
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Message */}
                  <Field label="Message" required>
                    <textarea
                      required
                      placeholder="Tell me about your project, timeline, and what you're hoping to build…"
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      rows={4}
                      style={{ ...inputStyle, resize: 'vertical', minHeight: '110px' }}
                      onFocus={(e) =>
                        ((e.currentTarget as HTMLElement).style.borderColor =
                          'var(--terracotta-500)')
                      }
                      onBlur={(e) =>
                        ((e.currentTarget as HTMLElement).style.borderColor =
                          'rgba(237,228,211,0.15)')
                      }
                    />
                  </Field>

                  {/* Error message */}
                  {error && (
                    <p
                      className="font-sans"
                      style={{
                        fontSize: '13px',
                        color: 'var(--terracotta-400)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    data-cursor="hover"
                    className="shiny-cta"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      marginTop: '0.25rem',
                      opacity: isSubmitting ? 0.65 : 1,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    <span>{isSubmitting ? 'Sending…' : 'Send message'}</span>
                  </button>
                </form>
              </motion.div>
            ) : (
              /* ── Success view ── */
              <motion.div
                key="success-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '2.5rem 1rem',
                  gap: '1.5rem',
                }}
              >
                {/* Animated checkmark circle */}
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.45, ease: EASE_OUT }}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--terracotta-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--terracotta-500)',
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>

                <div>
                  <h2
                    className="font-display italic"
                    style={{
                      fontSize: 'clamp(28px, 4vw, 38px)',
                      letterSpacing: '-0.03em',
                      color: 'var(--cream-50)',
                      lineHeight: 1.05,
                      marginBottom: '0.75rem',
                    }}
                  >
                    Message received.
                  </h2>
                  <p
                    className="font-sans"
                    style={{
                      fontSize: '16px',
                      color: 'rgba(237,228,211,0.6)',
                      letterSpacing: '-0.01em',
                      lineHeight: 1.65,
                      maxWidth: '32ch',
                      margin: '0 auto',
                    }}
                  >
                    I'll get back to you within 24–48 hours.
                  </p>
                </div>

                <Dialog.Close asChild>
                  <button
                    data-cursor="hover"
                    className="shiny-cta shiny-ghost"
                    style={{ marginTop: '0.25rem' }}
                  >
                    <span>Close</span>
                  </button>
                </Dialog.Close>
              </motion.div>
            )}
          </AnimatePresence>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
