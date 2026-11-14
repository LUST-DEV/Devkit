import { ToolPageHeader } from '../../components/ToolPageHeader'
import { UuidTool } from './UuidTool'

export function UuidPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <ToolPageHeader toolId="uuid" />
      <UuidTool />
    </div>
  )
}
