'use client'

import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

interface Props {
  content: string
}

// ── Custom renderers — maps markdown elements to design-system styles ─────────

const components: Components = {
  p({ children }) {
    return (
      <p
        className="font-sans"
        style={{
          fontSize: '18px',
          color: 'var(--forest-600)',
          lineHeight: 1.75,
          letterSpacing: '-0.01em',
          marginBottom: '1.5rem',
        }}
      >
        {children}
      </p>
    )
  },

  h2({ children }) {
    return (
      <h2
        className="font-display italic"
        style={{
          fontSize: 'clamp(26px, 3vw, 34px)',
          letterSpacing: '-0.025em',
          color: 'var(--forest-900)',
          lineHeight: 1.1,
          marginTop: '3rem',
          marginBottom: '1rem',
        }}
      >
        {children}
      </h2>
    )
  },

  h3({ children }) {
    return (
      <h3
        className="font-display italic"
        style={{
          fontSize: 'clamp(20px, 2.5vw, 26px)',
          letterSpacing: '-0.02em',
          color: 'var(--forest-900)',
          lineHeight: 1.2,
          marginTop: '2rem',
          marginBottom: '0.75rem',
        }}
      >
        {children}
      </h3>
    )
  },

  strong({ children }) {
    return (
      <strong
        className="font-sans"
        style={{ fontWeight: 600, color: 'var(--forest-900)' }}
      >
        {children}
      </strong>
    )
  },

  em({ children }) {
    return (
      <em
        className="font-display"
        style={{ fontStyle: 'italic', color: 'var(--forest-800)' }}
      >
        {children}
      </em>
    )
  },

  a({ href, children }) {
    return (
      <a
        href={href}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        data-cursor="hover"
        style={{
          color: 'var(--terracotta-500)',
          textDecoration: 'underline',
          textDecorationColor: 'rgba(200,85,61,0.4)',
          textUnderlineOffset: '3px',
          transition: 'text-decoration-color 0.2s',
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.textDecorationColor = 'var(--terracotta-500)')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.textDecorationColor = 'rgba(200,85,61,0.4)')
        }
      >
        {children}
      </a>
    )
  },

  blockquote({ children }) {
    return (
      <blockquote
        style={{
          borderLeft: '3px solid var(--terracotta-500)',
          paddingLeft: '1.5rem',
          margin: '2rem 0',
        }}
      >
        {children}
      </blockquote>
    )
  },

  ul({ children }) {
    return (
      <ul
        className="font-sans"
        style={{
          fontSize: '18px',
          color: 'var(--forest-600)',
          lineHeight: 1.75,
          letterSpacing: '-0.01em',
          paddingLeft: '1.5rem',
          marginBottom: '1.5rem',
          listStyleType: 'disc',
        }}
      >
        {children}
      </ul>
    )
  },

  ol({ children }) {
    return (
      <ol
        className="font-sans"
        style={{
          fontSize: '18px',
          color: 'var(--forest-600)',
          lineHeight: 1.75,
          letterSpacing: '-0.01em',
          paddingLeft: '1.5rem',
          marginBottom: '1.5rem',
          listStyleType: 'decimal',
        }}
      >
        {children}
      </ol>
    )
  },

  li({ children }) {
    return (
      <li style={{ marginBottom: '0.4rem' }}>
        {children}
      </li>
    )
  },

  code({ children, className }) {
    const isBlock = className?.startsWith('language-')
    if (isBlock) {
      return (
        <pre
          style={{
            background: 'var(--forest-900)',
            borderRadius: '8px',
            padding: '1.25rem 1.5rem',
            overflowX: 'auto',
            marginBottom: '1.5rem',
          }}
        >
          <code
            className="font-mono"
            style={{ fontSize: '14px', color: 'var(--cream-200)', lineHeight: 1.65 }}
          >
            {children}
          </code>
        </pre>
      )
    }
    return (
      <code
        className="font-mono"
        style={{
          fontSize: '14px',
          background: 'var(--cream-200)',
          color: 'var(--terracotta-600)',
          borderRadius: '4px',
          padding: '2px 6px',
        }}
      >
        {children}
      </code>
    )
  },

  hr() {
    return (
      <hr
        style={{
          border: 'none',
          borderTop: '1px solid var(--cream-300)',
          margin: '3rem 0',
        }}
      />
    )
  },
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function PostBody({ content }: Props) {
  return <ReactMarkdown components={components}>{content}</ReactMarkdown>
}
