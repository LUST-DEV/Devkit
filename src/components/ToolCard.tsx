import { Link } from 'react-router'
import type { ToolDefinition } from '../tools/registry'

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const Icon = tool.icon
  return (
    <Link
      to={tool.route}
      className="flex h-full items-start gap-3 rounded-lg border border-edge bg-panel p-4 hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent2"
    >
      <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent2" />
      <span className="min-w-0">
        <span className="block font-semibold">{tool.name}</span>
        <span className="block text-sm text-muted">{tool.description}</span>
        {tool.availability === 'planned' && (
          <span className="mt-2 inline-block rounded border border-edge px-2 py-0.5 text-xs text-muted">Coming soon</span>
        )}
      </span>
    </Link>
  )
}
