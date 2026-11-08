import { ToolCard } from '../components/ToolCard'
import { ToolPills } from '../components/ToolPills'
import { useToolHistory } from '../features/toolHistory/ToolHistoryProvider'
import { getToolById, tools } from '../tools/registry'
import type { ToolDefinition } from '../tools/registry'

const stats = [
  { value: String(tools.length), label: 'tools' },
  { value: '0', label: 'accounts' },
  { value: '0', label: 'telemetry events' },
]

function pickTools(ids: readonly string[]): ToolDefinition[] {
  return ids.map((id) => getToolById(id)).filter((tool): tool is ToolDefinition => tool !== undefined)
}

export function HomePage() {
  const { favorites, recents, recentsEnabled } = useToolHistory()
  const favoriteTools = pickTools(favorites)
  const recentTools = recentsEnabled ? pickTools(recents) : []

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="glass space-y-2 rounded-3xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">DEVKIT</h1>
        <p className="text-lg text-accent2">One workspace. Every developer tool.</p>
        <p className="text-sm text-muted">Local-first. No account. No telemetry. Your data never leaves your browser.</p>
      </header>

      <ul aria-label="Key figures" className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <li key={stat.label} className="glass grid aspect-[4/3] place-content-center rounded-2xl p-2 text-center">
            <span className="block text-3xl font-bold text-accent2 sm:text-4xl">{stat.value}</span>
            <span className="block text-xs text-muted sm:text-sm">{stat.label}</span>
          </li>
        ))}
      </ul>

      {favoriteTools.length > 0 && <ToolPills label="Favorites" items={favoriteTools} />}
      {recentTools.length > 0 && <ToolPills label="Recent" items={recentTools} />}
      <ToolPills label="Quick access" items={tools} />

      <section aria-labelledby="home-tools">
        <h2 id="home-tools" className="mb-3 text-lg font-semibold">
          Tools
        </h2>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-3">
          {tools.map((tool) => (
            <li key={tool.id}>
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
