import { JwtTool } from './JwtTool'

export function JwtPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">JWT Decoder</h1>
      <p className="text-muted">Inspect a JWT header and payload. Does not verify signatures.</p>
      <JwtTool />
    </div>
  )
}
