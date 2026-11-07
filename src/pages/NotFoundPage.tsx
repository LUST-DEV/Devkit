import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md space-y-4 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="text-muted">This page does not exist.</p>
      <Link to="/" className="text-accent2 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent2">
        Back to Dashboard
      </Link>
    </div>
  )
}
