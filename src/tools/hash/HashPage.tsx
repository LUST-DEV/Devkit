import { ToolPageHeader } from '../../components/ToolPageHeader'
import { HashTool } from './HashTool'

export function HashPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <ToolPageHeader toolId="hash" />
      <HashTool />
    </div>
  )
}
