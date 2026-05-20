import { create } from 'zustand'

interface TransitionState {
  isTransitioning: boolean
  targetPath: string | null
  start: (path: string) => void
  complete: () => void
}

export const useTransition = create<TransitionState>((set) => ({
  isTransitioning: false,
  targetPath: null,
  start: (path) => set({ isTransitioning: true, targetPath: path }),
  complete: () => set({ isTransitioning: false, targetPath: null }),
}))
