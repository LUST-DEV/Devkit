import { useMemo, useState } from 'react'
import { decodeBase64, encodeBase64 } from './base64'

type Mode = 'encode' | 'decode'

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent2'
const textareaClass = `w-full rounded-md border border-edge bg-panel p-3 font-mono text-sm ${focusRing}`
const buttonClass = `rounded-md border border-edge px-4 py-2 text-sm font-medium hover:bg-edge disabled:opacity-50 ${focusRing}`

export function Base64Tool() {
  const [mode, setMode] = useState<Mode>('encode')
  const [urlSafe, setUrlSafe] = useState(false)
  const [input, setInput] = useState('')
  const [copyStatus, setCopyStatus] = useState('')

  const result = useMemo(() => {
    if (input === '') {
      return null
    }
    return mode === 'encode' ? encodeBase64(input, { urlSafe }) : decodeBase64(input)
  }, [input, mode, urlSafe])

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
            name="base64-mode"
            checked={mode === 'encode'}
            onChange={() => {
              setMode('encode')
              setCopyStatus('')
            }}
            className="h-4 w-4 accent-accent"
          />
          Encode
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="base64-mode"
            checked={mode === 'decode'}
            onChange={() => {
              setMode('decode')
              setCopyStatus('')
            }}
            className="h-4 w-4 accent-accent"
          />
          Decode
        </label>
        {mode === 'encode' && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(event) => {
                setUrlSafe(event.target.checked)
                setCopyStatus('')
              }}
              className="h-4 w-4 accent-accent"
            />
            URL-safe alphabet (no padding)
          </label>
        )}
      </fieldset>

      <div className="space-y-1">
        <label htmlFor="base64-input" className="text-sm font-semibold">
          Input
        </label>
        <textarea
          id="base64-input"
          rows={8}
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

      <div className="space-y-1">
        <label htmlFor="base64-output" className="text-sm font-semibold">
          Output
        </label>
        <textarea id="base64-output" rows={8} value={output} readOnly spellCheck={false} className={textareaClass} />
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
