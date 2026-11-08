import { Link } from 'react-router'
import type { ToolDefinition } from '../tools/registry'

interface ToolPillsProps {
  label: string
  items: readonly ToolDefinition[]
}

// A horizontally scrollable row of tool shortcuts that snaps to each item on small screens.
export function ToolPills({ label, items }: ToolPillsProps) {
  return (
    <nav aria-label={label} className="space-y-3">
      <h2 className="text-lg font-semibold">{label}</h2>
      <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {items.map((tool) => {
          const Icon = tool.icon
          return (
            <li key={tool.id} className="shrink-0 snap-start">
              <Link
                to={tool.route}
                className="glass flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition hover:border-accent2"
              >
                <Icon aria-hidden="true" className="h-4 w-4 text-accent2" />
                {tool.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
