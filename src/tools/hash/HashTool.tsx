import { useEffect, useState } from 'react'
import { hashText, HASH_ALGORITHMS } from './hash'
import type { HashAlgorithm, HashResult } from './hash'

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent2'
const textareaClass = `w-full rounded-md border border-edge bg-panel p-3 font-mono text-sm ${focusRing}`
const buttonClass = `rounded-md border border-edge px-4 py-2 text-sm font-medium hover:bg-edge disabled:opacity-50 ${focusRing}`

export function HashTool() {
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256')
  const [input, setInput] = useState('')
  const [result, setResult] = useState<HashResult | null>(null)
  const [copyStatus, setCopyStatus] = useState('')

  useEffect(() => {
    if (input === '') {
      setResult(null)
      return
    }
    let cancelled = false
    void hashText(input, algorithm).then((next) => {
      if (!cancelled) {
        setResult(next)
      }
    })
    return () => {
      cancelled = true
    }
  }, [input, algorithm])

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
        <legend className="mb-2 text-sm font-semibold">Algorithm</legend>
        {HASH_ALGORITHMS.map((option) => (
          <label key={option} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="hash-algorithm"
              checked={algorithm === option}
              onChange={() => {
                setAlgorithm(option)
                setCopyStatus('')
              }}
              className="h-4 w-4 accent-accent"
            />
            {option}
          </label>
        ))}
      </fieldset>

      <div className="space-y-1">
        <label htmlFor="hash-input" className="text-sm font-semibold">
          Input
        </label>
        <textarea
          id="hash-input"
          rows={6}
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
        <label htmlFor="hash-output" className="text-sm font-semibold">
          Output
        </label>
        <textarea id="hash-output" rows={4} value={output} readOnly spellCheck={false} className={textareaClass} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" disabled={output === ''} onClick={() => void copyOutput()} className={buttonClass}>
          Copy result
        </button>
        <span role="status" className="text-sm text-muted">
          {copyStatus}
        </span>
      </div>

      <p className="text-sm text-muted">Hashed locally with the Web Crypto API. Nothing is stored or sent anywhere.</p>
    </div>
  )
}
