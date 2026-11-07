import { HashTool } from './HashTool'

export function HashPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Hash Generator</h1>
      <p className="text-muted">Compute SHA-256, SHA-384 and SHA-512 hashes.</p>
      <HashTool />
    </div>
  )
}
