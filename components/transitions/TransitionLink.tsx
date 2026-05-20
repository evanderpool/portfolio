'use client'
import Link, { type LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import { type ReactNode, type MouseEvent, type AnchorHTMLAttributes } from 'react'
import { useTransition } from '@/store/transition'
import { getPrefersReducedMotion } from '@/lib/motion'

type TransitionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  LinkProps & {
    children: ReactNode
  }

export function TransitionLink({ href, children, onClick, ...props }: TransitionLinkProps) {
  const router = useRouter()
  const { start } = useTransition()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (getPrefersReducedMotion()) return // let native navigation handle it

    const target = typeof href === 'string' ? href : href.pathname ?? '/'
    e.preventDefault()
    start(target)
    // Wait for curtain to fully cover before navigating
    setTimeout(() => {
      router.push(target)
    }, 800)
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
