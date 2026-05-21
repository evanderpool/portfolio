'use client'
import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Optional slot rendered when an error is caught. Defaults to null (silent). */
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Catches any unhandled render / useEffect errors thrown by descendant client
 * components so a single crash cannot unmount the entire page.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComplexClientComponent />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Log to console in all environments so you can see what broke.
    console.error('[ErrorBoundary] caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null
    }
    return this.props.children
  }
}
