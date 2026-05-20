'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'

export type HoveredCard = {
  rect: DOMRect
  cover: string
  accent: string
} | null

type HoverCtx = {
  hovered: HoveredCard
  setHovered: (h: HoveredCard) => void
}

const HoverContext = createContext<HoverCtx>({
  hovered: null,
  setHovered: () => {},
})

export function HoverProvider({ children }: { children: ReactNode }) {
  const [hovered, setHovered] = useState<HoveredCard>(null)
  return (
    <HoverContext.Provider value={{ hovered, setHovered }}>
      {children}
    </HoverContext.Provider>
  )
}

export const useHover = () => useContext(HoverContext)
