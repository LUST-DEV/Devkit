import { useI18n } from '../i18n/I18nProvider'
import { getToolById } from '../tools/registry'

// Title and description of a tool page, in the language of the interface.
export function ToolPageHeader({ toolId }: { toolId: string }) {
  const { tool } = useI18n()
  const definition = getToolById(toolId)
  if (!definition) {
    return null
  }
  const text = tool(definition)
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">{text.name}</h1>
      <p className="text-muted">{text.description}</p>
    </>
  )
}
