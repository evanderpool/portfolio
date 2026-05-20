import { forwardRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  id: string
  className?: string
  children: ReactNode
}

const SectionWrapper = forwardRef<HTMLElement, Props>(
  ({ id, className, children }, ref) => (
    <section ref={ref} id={id} className={cn('relative w-full overflow-hidden', className)}>
      {children}
    </section>
  )
)
SectionWrapper.displayName = 'SectionWrapper'
export default SectionWrapper
