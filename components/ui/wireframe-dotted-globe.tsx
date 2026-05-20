'use client'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface WireframeDottedGlobeProps {
  className?: string
}

export default function WireframeDottedGlobe({ className = '' }: WireframeDottedGlobeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas  = canvasRef.current
    if (!wrapper || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    let w = 0
    let h = 0
    let baseRadius = 0

    // projection is defined before setSize so setSize can update translate
    const projection = d3.geoOrthographic()
      .scale(1)
      .translate([0, 0])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(ctx)

    const setSize = () => {
      w = wrapper.clientWidth
      h = wrapper.clientHeight
      baseRadius = Math.min(w, h) / 2.2
      canvas.width  = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width  = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      projection.translate([w / 2, h / 2])
      projection.scale(baseRadius)
    }

    setSize()

    // ── dot helpers ──────────────────────────────────────────────────────────

    const pointInRing = (pt: [number, number], ring: number[][]): boolean => {
      const [x, y] = pt
      let inside = false
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i]
        const [xj, yj] = ring[j]
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
      }
      return inside
    }

    const pointInFeature = (pt: [number, number], feature: GeoJSON.Feature): boolean => {
      const geom = feature.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon
      if (geom.type === 'Polygon') {
        if (!pointInRing(pt, geom.coordinates[0] as number[][])) return false
        for (let i = 1; i < geom.coordinates.length; i++) {
          if (pointInRing(pt, geom.coordinates[i] as number[][])) return false
        }
        return true
      }
      if (geom.type === 'MultiPolygon') {
        for (const poly of geom.coordinates) {
          if (pointInRing(pt, poly[0] as number[][])) {
            let inHole = false
            for (let i = 1; i < poly.length; i++) {
              if (pointInRing(pt, poly[i] as number[][])) { inHole = true; break }
            }
            if (!inHole) return true
          }
        }
      }
      return false
    }

    const generateDots = (feature: GeoJSON.Feature): [number, number][] => {
      const dots: [number, number][] = []
      const [[minLng, minLat], [maxLng, maxLat]] = d3.geoBounds(feature)
      const step = 16 * 0.08
      for (let lng = minLng; lng <= maxLng; lng += step) {
        for (let lat = minLat; lat <= maxLat; lat += step) {
          const pt: [number, number] = [lng, lat]
          if (pointInFeature(pt, feature)) dots.push(pt)
        }
      }
      return dots
    }

    // ── render ────────────────────────────────────────────────────────────────

    const allDots: [number, number][] = []
    let land: GeoJSON.FeatureCollection | null = null

    const render = () => {
      const scale = projection.scale()
      const sf = scale / baseRadius

      ctx.clearRect(0, 0, w, h)

      // Ocean fill + globe border
      ctx.beginPath()
      ctx.arc(w / 2, h / 2, scale, 0, Math.PI * 2)
      ctx.fillStyle = '#0D1510'
      ctx.fill()
      ctx.strokeStyle = '#B89B5E'
      ctx.lineWidth = 1.5 * sf
      ctx.stroke()

      if (!land) return

      // Graticule
      const graticule = d3.geoGraticule()
      ctx.beginPath()
      path(graticule())
      ctx.strokeStyle = '#D9CDB5'
      ctx.lineWidth = 0.5 * sf
      ctx.globalAlpha = 0.18
      ctx.stroke()
      ctx.globalAlpha = 1

      // Land outlines (terracotta)
      ctx.beginPath()
      land.features.forEach(f => path(f))
      ctx.strokeStyle = '#C8553D'
      ctx.lineWidth = 0.9 * sf
      ctx.stroke()

      // Land dots (gold)
      const dotR = 1.4 * sf
      ctx.fillStyle = '#B89B5E'
      for (const [lng, lat] of allDots) {
        const p = projection([lng, lat])
        if (!p || p[0] < 0 || p[0] > w || p[1] < 0 || p[1] > h) continue
        ctx.beginPath()
        ctx.arc(p[0], p[1], dotR, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // ── rotation timer ────────────────────────────────────────────────────────

    const rot: [number, number, number] = [0, -15, 0]
    let autoRotate = true
    let stopped    = false

    const timer = d3.timer(() => {
      if (stopped || !autoRotate) return
      rot[0] += 0.25
      projection.rotate(rot)
      render()
    })

    // ── drag interaction ──────────────────────────────────────────────────────

    const onMouseDown = (e: MouseEvent) => {
      autoRotate = false
      const sx = e.clientX
      const sy = e.clientY
      const sr: [number, number, number] = [rot[0], rot[1], rot[2]]

      const onMove = (me: MouseEvent) => {
        rot[0] = sr[0] + (me.clientX - sx) * 0.35
        rot[1] = Math.max(-80, Math.min(80, sr[1] - (me.clientY - sy) * 0.35))
        projection.rotate(rot)
        render()
      }

      const onUp = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
        if (!stopped) setTimeout(() => { autoRotate = true }, 80)
      }

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    }

    canvas.addEventListener('mousedown', onMouseDown)

    // ── window resize ─────────────────────────────────────────────────────────

    const onResize = () => {
      setSize()
      render()
    }
    window.addEventListener('resize', onResize)

    // ── geo data ──────────────────────────────────────────────────────────────

    const controller = new AbortController()

    fetch(
      'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json',
      { signal: controller.signal }
    )
      .then(r => (r.ok ? r.json() : null))
      .then((data: GeoJSON.FeatureCollection | null) => {
        if (!data || stopped) return
        land = data
        // Offload heavy dot-generation to an idle callback so it doesn't
        // block the main thread during the Hero entrance animation.
        const schedule = typeof requestIdleCallback !== 'undefined'
          ? requestIdleCallback
          : (cb: () => void) => setTimeout(cb, 0)
        schedule(() => {
          if (stopped) return
          land!.features.forEach(f => {
            generateDots(f).forEach(pt => allDots.push(pt))
          })
        })
      })
      .catch(() => {})

    return () => {
      stopped = true
      controller.abort()
      timer.stop()
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div ref={wrapperRef} className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        data-cursor="hover"
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />
      <span
        className="absolute bottom-5 right-6 font-mono uppercase pointer-events-none select-none"
        style={{ fontSize: '9px', color: 'var(--cream-300)', opacity: 0.45, letterSpacing: '0.15em' }}
      >
        Drag to explore
      </span>
    </div>
  )
}
