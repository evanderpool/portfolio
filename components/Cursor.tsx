'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let mouse = { x: -200, y: -200 }
    let ring  = { x: -200, y: -200 }
    let targetScale = 1
    let currentScale = 1
    let inverted = false
    let raf = 0

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', onMove)

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-cursor="hover"]')
      if (el) { targetScale = 1.8; inverted = true }
    }
    const onOut = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-cursor="hover"]')
      if (el) { targetScale = 1; inverted = false }
    }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout',  onOut)

    const DOT_R  = 4
    const RING_R = 16
    const LERP   = 0.12

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ring.x += (mouse.x - ring.x) * LERP
      ring.y += (mouse.y - ring.y) * LERP
      currentScale += (targetScale - currentScale) * 0.1

      const dotColor  = inverted ? '#F5EFE6' : '#C8553D'
      const ringColor = inverted ? '#C8553D' : '#F5EFE6'

      // ring
      ctx.beginPath()
      ctx.arc(ring.x, ring.y, RING_R * currentScale, 0, Math.PI * 2)
      ctx.strokeStyle = ringColor
      ctx.lineWidth = 1.5
      ctx.stroke()

      // dot
      ctx.beginPath()
      ctx.arc(mouse.x, mouse.y, DOT_R, 0, Math.PI * 2)
      ctx.fillStyle = dotColor
      ctx.fill()

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ mixBlendMode: 'difference' }}
      aria-hidden
    />
  )
}
