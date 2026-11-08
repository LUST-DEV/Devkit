import { Star } from 'lucide-react'
import { Link } from 'react-router'
import { useToolHistory } from '../features/toolHistory/ToolHistoryProvider'
import type { ToolDefinition } from '../tools/registry'

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const Icon = tool.icon
  const { favorites, toggleFavorite } = useToolHistory()
  const isFavorite = favorites.includes(tool.id)

  return (
    <div className="relative h-full">
      <Link
        to={tool.route}
        className="glass flex h-full items-start gap-4 rounded-2xl p-4 pr-16 transition duration-200 hover:-translate-y-0.5 hover:border-accent2"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-edge text-accent2">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">{tool.name}</span>
          <span className="block text-sm text-muted">{tool.description}</span>
          {tool.availability === 'planned' && (
            <span className="mt-2 inline-block rounded-full border border-edge px-2 py-0.5 text-xs text-muted">Coming soon</span>
          )}
        </span>
      </Link>
      <button
        type="button"
        aria-pressed={isFavorite}
        aria-label={`Favorite ${tool.name}`}
        onClick={() => toggleFavorite(tool.id)}
        className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full text-muted transition-colors hover:bg-edge hover:text-fg"
      >
        <Star aria-hidden="true" className={`h-5 w-5 ${isFavorite ? 'fill-current text-accent2' : ''}`} />
      </button>
    </div>
  )
}
