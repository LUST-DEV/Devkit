export function PageSkeleton() {
  return (
    <div role="status" aria-live="polite" className="mx-auto max-w-4xl space-y-4">
      <span className="sr-only">Loading</span>
      <div className="skeleton h-9 w-1/3" />
      <div className="skeleton h-4 w-2/3" />
      <div className="grid gap-3 pt-2 sm:grid-cols-2">
        <div className="skeleton h-24" />
        <div className="skeleton h-24" />
        <div className="skeleton h-24" />
        <div className="skeleton h-24" />
      </div>
    </div>
  )
}
