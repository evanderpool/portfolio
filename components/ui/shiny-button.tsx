'use client'

import type React from 'react'

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'default' | 'ghost'
  size?: 'default' | 'sm'
}

export function ShinyButton({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}: ShinyButtonProps) {
  const classes = [
    'shiny-cta',
    variant === 'ghost' ? 'shiny-ghost' : '',
    size === 'sm' ? 'shiny-sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} data-cursor="hover" {...props}>
      <span>{children}</span>
    </button>
  )
}
