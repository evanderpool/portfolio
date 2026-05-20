import type { Metadata } from 'next'
import Nav     from '@/components/Nav'
import Contact from '@/components/sections/Contact'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch — open to freelance, full-time roles, and creative collaborations.',
}

export default function ContactPage() {
  return (
    <main>
      <Nav />
      <Contact />
    </main>
  )
}
