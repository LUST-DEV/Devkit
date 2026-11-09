import { Lightbulb } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ToolDefinition } from '../../tools/registry'
import { getToolGuide } from './toolGuides'

// A short guide for one tool, behind a floating button.
export function ToolGuide({ tool }: { tool: ToolDefinition }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="glass fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition hover:border-accent2"
      >
        <Lightbulb aria-hidden="true" className="h-4 w-4 text-accent2" />
        Guide
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center overscroll-contain bg-black/60 p-4 sm:items-center"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              close()
            }
          }}
        >
          <div role="dialog" aria-modal="true" aria-label={`${tool.name} guide`} className="glass page-enter w-full max-w-md space-y-4 rounded-2xl p-5">
            <h2 className="text-lg font-semibold">{tool.name}</h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              {getToolGuide(tool.id).map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ol>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="min-h-11 w-full rounded-xl bg-accent px-4 text-sm font-medium text-white"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}
