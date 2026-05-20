import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export function useMagneticTilt(strength = 12) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const el = ref.current
    if (!el) return

    const xTo = gsap.quickTo(el, 'rotateY', { duration: 0.6, ease: 'power2.out' })
    const yTo = gsap.quickTo(el, 'rotateX', { duration: 0.6, ease: 'power2.out' })

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height
      xTo(x * strength)
      yTo(-y * strength)
    }

    const handleLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)

    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
      xTo(0)
      yTo(0)
    }
  }, [strength])

  return ref
}
