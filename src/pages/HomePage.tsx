import { ToolCard } from '../components/ToolCard'
import { tools } from '../tools/registry'

export function HomePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="glass space-y-2 rounded-3xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">DEVKIT</h1>
        <p className="text-lg text-accent2">One workspace. Every developer tool.</p>
        <p className="text-sm text-muted">Local-first. No account. No telemetry. Your data never leaves your browser.</p>
      </header>
      <section aria-labelledby="home-tools">
        <h2 id="home-tools" className="mb-3 text-lg font-semibold">
          Tools
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
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
