import { Link } from 'react-router'
import type { ToolDefinition } from '../tools/registry'

export function ToolPlaceholderPage({ tool }: { tool: ToolDefinition }) {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">{tool.name}</h1>
      <p className="text-muted">{tool.description}</p>
      <p className="rounded-md border border-edge bg-panel p-4 text-sm">This tool is not implemented yet.</p>
      <Link to="/tools" className="text-accent2 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent2">
        Back to all tools
      </Link>
    </div>
  )
}
