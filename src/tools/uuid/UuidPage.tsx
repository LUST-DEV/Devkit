import { UuidTool } from './UuidTool'

export function UuidPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">UUID Generator</h1>
      <p className="text-muted">Generate UUIDs with a cryptographically secure source.</p>
      <UuidTool />
    </div>
  )
}
