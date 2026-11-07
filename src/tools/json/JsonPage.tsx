import { JsonTool } from './JsonTool'

export function JsonPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">JSON Formatter &amp; Validator</h1>
      <p className="text-muted">Format and validate JSON with readable errors.</p>
      <JsonTool />
    </div>
  )
}
