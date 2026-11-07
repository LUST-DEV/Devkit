import { Component } from 'react'
import type { ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  failed: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) {
      return this.props.children
    }
    return (
      <div role="alert" className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 bg-app px-6 text-center text-fg">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-sm text-muted">An unexpected error occurred. Nothing was sent anywhere.</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => this.setState({ failed: false })}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent2"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border border-edge px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent2"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    )
  }
}
