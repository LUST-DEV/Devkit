import { ToolPageHeader } from '../../components/ToolPageHeader'
import { TimestampTool } from './TimestampTool'

export function TimestampPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <ToolPageHeader toolId="timestamp" />
      <TimestampTool />
    </div>
  )
}
