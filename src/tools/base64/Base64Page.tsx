import { Base64Tool } from './Base64Tool'

export function Base64Page() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Base64 Encoder / Decoder</h1>
      <p className="text-muted">Encode and decode Base64, including Unicode text.</p>
      <Base64Tool />
    </div>
  )
}
