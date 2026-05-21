import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Cursor        from '@/components/Cursor'
import Providers     from '@/components/Providers'
import { PageCurtain } from '@/components/transitions/PageCurtain'
import Loader        from '@/components/Loader'
import Footer        from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz', 'SOFT', 'WONK'],
  variable: '--font-fraunces',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',   // respect the Dynamic Island / notch safe area on iPhone 14 Pro Max
}

export const metadata: Metadata = {
  metadataBase: new URL('https://erickvanderpool.com'),
  title: {
    template: '%s — Erick Vanderpool',
    default: 'Erick Vanderpool — Full-Stack Engineer & Content Creator',
  },
  description: 'Building databases, web experiences, and content systems. Full-stack engineer based in the US.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://erickvanderpool.com',
    siteName: 'Erick Vanderpool',
    title: 'Erick Vanderpool — Full-Stack Engineer & Content Creator',
    description: 'Building databases, web experiences, and content systems.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Erick Vanderpool — Full-Stack Engineer & Content Creator',
    description: 'Building databases, web experiences, and content systems.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} grain`}
    >
      <body>
        <ErrorBoundary>
          <Loader />
          <Cursor />
          <PageCurtain />
          <Providers>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
            <Footer />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
