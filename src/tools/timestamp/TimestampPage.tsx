import { TimestampTool } from './TimestampTool'

export function TimestampPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Timestamp Converter</h1>
      <p className="text-muted">Convert between timestamps and dates, UTC and time zones.</p>
      <TimestampTool />
    </div>
  )
}
