import { ToolPageHeader } from '../../components/ToolPageHeader'
import { JwtTool } from './JwtTool'

export function JwtPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <ToolPageHeader toolId="jwt" />
      <JwtTool />
    </div>
  )
}
