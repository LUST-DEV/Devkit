import { useMemo, useState } from 'react'
import { formatJson, minifyJson } from './json'
import type { IndentOption } from './json'

type Mode = 'format' | 'minify'

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent2'
const textareaClass = `w-full rounded-md border border-edge bg-panel p-3 font-mono text-sm ${focusRing}`
const buttonClass = `rounded-md border border-edge px-4 py-2 text-sm font-medium hover:bg-edge disabled:opacity-50 ${focusRing}`
const fieldClass = `rounded-md border border-edge bg-panel p-2 text-sm ${focusRing}`

export function JsonTool() {
  const [mode, setMode] = useState<Mode>('format')
  const [indent, setIndent] = useState<IndentOption>('2')
  const [input, setInput] = useState('')
  const [copyStatus, setCopyStatus] = useState('')

  const result = useMemo(() => {
    if (input === '') {
      return null
    }
    return mode === 'format' ? formatJson(input, indent) : minifyJson(input)
  }, [input, mode, indent])

  const output = result?.ok ? result.value : ''
  const error = result && !result.ok ? result.error : ''

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
      <fieldset className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <legend className="mb-2 text-sm font-semibold">Mode</legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="json-mode"
            checked={mode === 'format'}
            onChange={() => {
              setMode('format')
              setCopyStatus('')
            }}
            className="h-4 w-4 accent-accent"
          />
          Format
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="json-mode"
            checked={mode === 'minify'}
            onChange={() => {
              setMode('minify')
              setCopyStatus('')
            }}
            className="h-4 w-4 accent-accent"
          />
          Minify
        </label>
        {mode === 'format' && (
          <div className="flex items-center gap-2">
            <label htmlFor="json-indent" className="text-sm">
              Indentation
            </label>
            <select
              id="json-indent"
              value={indent}
              onChange={(event) => {
                setIndent(event.target.value as IndentOption)
                setCopyStatus('')
              }}
              className={fieldClass}
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="tab">Tab</option>
            </select>
          </div>
        )}
      </fieldset>

      <div className="space-y-1">
        <label htmlFor="json-input" className="text-sm font-semibold">
          Input
        </label>
        <textarea
          id="json-input"
          rows={10}
          value={input}
          onChange={(event) => {
            setInput(event.target.value)
            setCopyStatus('')
          }}
          spellCheck={false}
          autoComplete="off"
          className={textareaClass}
        />
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-edge bg-panel p-3 text-sm">
          {error}
        </p>
      )}
      {result?.ok && (
        <p role="status" className="text-sm text-accent2">
          Valid JSON.
        </p>
      )}

      <div className="space-y-1">
        <label htmlFor="json-output" className="text-sm font-semibold">
          Output
        </label>
        <textarea id="json-output" rows={10} value={output} readOnly spellCheck={false} className={textareaClass} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" disabled={output === ''} onClick={() => void copyOutput()} className={buttonClass}>
          Copy result
        </button>
        <button
          type="button"
          disabled={input === ''}
          onClick={() => {
            setInput('')
            setCopyStatus('')
          }}
          className={buttonClass}
        >
          Clear
        </button>
        <span role="status" className="text-sm text-muted">
          {copyStatus}
        </span>
      </div>

      <p className="text-sm text-muted">Processed locally in your browser. Nothing is stored or sent anywhere.</p>
    </div>
  )
}
