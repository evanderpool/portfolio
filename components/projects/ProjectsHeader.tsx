'use client'
import { motion } from 'framer-motion'

export const FILTERS = ['ALL', 'ENGINEERING', 'DATABASES'] as const
export type Filter = (typeof FILTERS)[number]

type Props = {
  active: Filter
  onFilter: (f: Filter) => void
  total: number
  visible: number
  hidePills?: boolean
}

export function ProjectsHeader({ active, onFilter, total, visible, hidePills }: Props) {
  return (
    <div className="flex items-start justify-between flex-wrap gap-6">
      <div className="flex flex-col gap-1">
        <span
          className="font-mono uppercase tracking-[0.2em]"
          style={{ fontSize: '11px', color: 'var(--gold-500)' }}
        >
          ELEMENTS OF THE WORK
        </span>
        <span
          className="font-mono"
          style={{ fontSize: '11px', color: 'var(--forest-400)', letterSpacing: '0.05em' }}
        >
          INDEX {String(visible).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {!hidePills && <div
        className="flex items-center gap-0.5 flex-wrap"
        role="group"
        aria-label="Filter projects by category"
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => onFilter(f)}
            data-cursor="hover"
            className="relative px-3.5 py-2 font-mono uppercase transition-colors duration-200"
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: active === f ? 'var(--terracotta-500)' : 'var(--forest-400)',
              background: 'transparent',
              border: 'none',
            }}
            aria-pressed={active === f}
          >
            {f}
            {active === f && (
              <motion.div
                layoutId="filter-active"
                className="absolute bottom-0 left-3.5 right-3.5 h-px"
                style={{ background: 'var(--terracotta-500)' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </button>
        ))}
      </div>}
    </div>
  )
}
