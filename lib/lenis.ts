'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useLenis() {
  useEffect(() => {
    // Touch devices (phones, tablets) use native OS scroll — Lenis intercepts
    // touch events and completely breaks scrolling on mobile. Skip it entirely
    // and let ScrollTrigger run on its own via the native scroll position.
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) {
      requestAnimationFrame(() => ScrollTrigger.refresh())
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenis.on('scroll', () => ScrollTrigger.update())

    const ticker = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(ticker)
    // Smooth over frame drops > 33 ms without disabling smoothing entirely
    gsap.ticker.lagSmoothing(500, 33)

    // Refresh after Lenis processes its first tick so ScrollTrigger
    // measures positions against the fully-initialized scroll setup.
    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      lenis.destroy()
      gsap.ticker.remove(ticker)
    }
  }, [])
}
