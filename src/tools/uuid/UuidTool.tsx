import { useState } from 'react'
import { generateUuids, MAX_COUNT, MIN_COUNT } from './uuid'
import type { UuidResult } from './uuid'

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent2'
const fieldClass = `rounded-md border border-edge bg-panel p-2 text-sm ${focusRing}`
const textareaClass = `w-full rounded-md border border-edge bg-panel p-3 font-mono text-sm ${focusRing}`
const buttonClass = `rounded-md border border-edge px-4 py-2 text-sm font-medium hover:bg-edge disabled:opacity-50 ${focusRing}`

export function UuidTool() {
  const [count, setCount] = useState('1')
  const [uppercase, setUppercase] = useState(false)
  const [hyphens, setHyphens] = useState(true)
  const [result, setResult] = useState<UuidResult | null>(null)
  const [copyStatus, setCopyStatus] = useState('')

  const output = result?.ok ? result.values.join('\n') : ''
  const error = result && !result.ok ? result.error : ''

  function generate() {
    setResult(generateUuids({ count: Number(count), uppercase, hyphens }))
    setCopyStatus('')
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output)
      setCopyStatus('Copied to clipboard.')
    } catch {
      setCopyStatus('Copy failed. Select the text and copy it manually.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="space-y-1">
          <label htmlFor="uuid-count" className="block text-sm font-semibold">
            Number of UUIDs
          </label>
          <input
            id="uuid-count"
            type="number"
            inputMode="numeric"
            min={MIN_COUNT}
            max={MAX_COUNT}
            value={count}
            onChange={(event) => setCount(event.target.value)}
            className={`w-32 ${fieldClass}`}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={uppercase} onChange={(event) => setUppercase(event.target.checked)} className="h-4 w-4 accent-accent" />
          Uppercase
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hyphens} onChange={(event) => setHyphens(event.target.checked)} className="h-4 w-4 accent-accent" />
          Hyphens
        </label>
        <button
          type="button"
          onClick={generate}
          className={`rounded-md bg-accent px-4 py-2 text-sm font-medium text-white ${focusRing}`}
        >
          Generate
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-edge bg-panel p-3 text-sm">
          {error}
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor="uuid-output" className="text-sm font-semibold">
          Output
        </label>
        <textarea id="uuid-output" rows={8} value={output} readOnly spellCheck={false} className={textareaClass} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" disabled={output === ''} onClick={() => void copyOutput()} className={buttonClass}>
          Copy result
        </button>
        <span role="status" className="text-sm text-muted">
          {copyStatus}
        </span>
      </div>

      <p className="text-sm text-muted">Generated locally with the browser secure random source. Nothing is stored or sent anywhere.</p>
    </div>
  )
}
