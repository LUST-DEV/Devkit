import { ToolPageHeader } from '../../components/ToolPageHeader'
import { Base64Tool } from './Base64Tool'

export function Base64Page() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <ToolPageHeader toolId="base64" />
      <Base64Tool />
    </div>
  )
}
