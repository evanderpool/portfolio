import type { Metadata } from 'next'
import AnimatedNav from '@/components/ui/navigation-menu'
import Contact from '@/components/sections/Contact'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch — open to freelance, full-time roles, and creative collaborations.',
}

export default function ContactPage() {
  return (
    <main>
      <AnimatedNav />
      <Contact />
    </main>
  )
}
