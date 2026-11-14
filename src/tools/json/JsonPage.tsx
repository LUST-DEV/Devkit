import { ToolPageHeader } from '../../components/ToolPageHeader'
import { JsonTool } from './JsonTool'

export function JsonPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <ToolPageHeader toolId="json" />
      <JsonTool />
    </div>
  )
}
