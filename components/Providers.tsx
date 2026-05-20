'use client'
import { ReactNode } from 'react'
import { useLenis } from '@/lib/lenis'

export default function Providers({ children }: { children: ReactNode }) {
  useLenis()
  return <>{children}</>
}
