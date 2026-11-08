import { Link } from 'react-router'
import { ToolCard } from '../components/ToolCard'
import { tools } from '../tools/registry'

const stats = [
  { value: String(tools.length), label: 'tools' },
  { value: '0', label: 'accounts' },
  { value: '0', label: 'telemetry events' },
]

export function HomePage() {
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

      <nav aria-label="Quick access" className="space-y-3">
        <h2 className="text-lg font-semibold">Quick access</h2>
        <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {tools.map((tool) => {
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
