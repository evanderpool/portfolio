export const EASE_OUT     = [0.16, 1, 0.3, 1] as const
export const EASE_IN_OUT  = [0.65, 0, 0.35, 1] as const
export const DUR_UI       = 0.8
export const DUR_HERO     = 1.2
export const DUR_CINEMATIC = 2.5
export const STAGGER      = 0.07

// Page curtain transition timing
export const DUR_CURTAIN_IN  = 0.7
export const DUR_CURTAIN_OUT = 0.8
export const DELAY_CONTENT   = 0.9
export const STAGGER_STRIP   = 0.04

export function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
