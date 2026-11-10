import { ToolCard } from '../components/ToolCard'
import { tools } from '../tools/registry'

export function ToolsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Tools</h1>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-3">
        {tools.map((tool, index) => (
          <li key={tool.id}>
            <ToolCard tool={tool} isFirst={index === 0} />
          </li>
        ))}
      </ul>
    </div>
  )
}
