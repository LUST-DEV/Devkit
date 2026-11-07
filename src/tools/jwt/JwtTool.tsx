import { useMemo, useState } from 'react'
import { decodeJwt } from './jwt'

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent2'
const textareaClass = `w-full rounded-md border border-edge bg-panel p-3 font-mono text-sm ${focusRing}`
const buttonClass = `rounded-md border border-edge px-4 py-2 text-sm font-medium hover:bg-edge disabled:opacity-50 ${focusRing}`

export function JwtTool() {
  const [input, setInput] = useState('')

  const result = useMemo(() => (input.trim() === '' ? null : decodeJwt(input)), [input])
  const decoded = result?.ok ? result : null
  const error = result && !result.ok ? result.error : ''

  return (
    <div className="space-y-4">
      <p role="note" className="rounded-md border border-edge bg-panel p-3 text-sm">
        Decoding does not verify the signature. Do not trust the content of a token until its signature has been verified by your server.
      </p>

      <div className="space-y-1">
        <label htmlFor="jwt-input" className="text-sm font-semibold">
          Token
        </label>
        <textarea
          id="jwt-input"
          rows={6}
          value={input}
          onChange={(event) => setInput(event.target.value)}
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

      {decoded && decoded.warnings.length > 0 && (
        <ul aria-label="Warnings" className="list-disc space-y-1 pl-5 text-sm">
          {decoded.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      )}

      <div className="space-y-1">
        <label htmlFor="jwt-header" className="text-sm font-semibold">
          Header
        </label>
        <textarea id="jwt-header" rows={5} value={decoded?.headerText ?? ''} readOnly spellCheck={false} className={textareaClass} />
      </div>

      <div className="space-y-1">
        <label htmlFor="jwt-payload" className="text-sm font-semibold">
          Payload
        </label>
        <textarea id="jwt-payload" rows={8} value={decoded?.payloadText ?? ''} readOnly spellCheck={false} className={textareaClass} />
      </div>

      {decoded && decoded.timeClaims.length > 0 && (
        <section aria-labelledby="jwt-times" className="space-y-1">
          <h2 id="jwt-times" className="text-sm font-semibold">
            Time claims (UTC)
          </h2>
          <ul className="space-y-1 text-sm">
            {decoded.timeClaims.map((claim) => (
              <li key={claim.claim}>
                <span className="font-mono">{claim.claim}</span>: {claim.iso}
                {claim.status ? ` (${claim.status})` : ''}
              </li>
            ))}
          </ul>
        </section>
      )}

      <button type="button" disabled={input === ''} onClick={() => setInput('')} className={buttonClass}>
        Clear
      </button>

      <p className="text-sm text-muted">Decoded locally in your browser. The token is never stored or sent anywhere.</p>
    </div>
  )
}
