import { useMemo, useState } from 'react'
import { convertInput, detectTimeZone, getTimeZones } from './timestamp'
import type { TimeUnit } from './timestamp'

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent2'
const fieldClass = `rounded-md border border-edge bg-panel p-2 text-sm ${focusRing}`
const buttonClass = `rounded-md border border-edge px-3 py-1.5 text-sm font-medium hover:bg-edge disabled:opacity-50 ${focusRing}`

const LOCALES: readonly { value: string; label: string }[] = [
  { value: '', label: 'Browser default' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'fr-FR', label: 'Francais (France)' },
  { value: 'es-ES', label: 'Espanol (Espana)' },
  { value: 'de-DE', label: 'Deutsch (Deutschland)' },
  { value: 'ja-JP', label: 'Japanese (Japan)' },
]

function browserLocale(): string {
  return (typeof navigator !== 'undefined' && navigator.language) || 'en-US'
}

export function TimestampTool() {
  const [input, setInput] = useState('')
  const [unit, setUnit] = useState<TimeUnit>('auto')
  const [timeZone, setTimeZone] = useState(detectTimeZone)
  const [locale, setLocale] = useState('')
  const [copyStatus, setCopyStatus] = useState('')

  const timeZones = useMemo(() => {
    const zones = getTimeZones()
    return zones.includes(timeZone) ? zones : [timeZone, ...zones]
  }, [timeZone])

  const result = useMemo(() => {
    if (input.trim() === '') {
      return null
    }
    return convertInput(input, { unit, timeZone, locale: locale === '' ? browserLocale() : locale })
  }, [input, unit, timeZone, locale])

  const details = result?.ok ? result.details : null
  const error = result && !result.ok ? result.error : ''

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopyStatus('Copied to clipboard.')
    } catch {
      setCopyStatus('Copy failed. Select the text and copy it manually.')
    }
  }

  const rows: { label: string; value: string }[] = details
    ? [
        { label: 'Unix time (seconds)', value: String(details.seconds) },
        { label: 'Unix time (milliseconds)', value: String(details.milliseconds) },
        { label: 'ISO 8601 (UTC)', value: details.iso },
        { label: 'Selected time zone', value: details.zoned },
        { label: 'UTC offset', value: details.offset },
      ]
    : []

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="ts-input" className="text-sm font-semibold">
          Timestamp or date
        </label>
        <div className="flex gap-2">
          <input
            id="ts-input"
            type="text"
            value={input}
            onChange={(event) => {
              setInput(event.target.value)
              setCopyStatus('')
            }}
            placeholder="1516239022 or 2018-01-18 01:30:22"
            spellCheck={false}
            autoComplete="off"
            className={`w-full font-mono ${fieldClass}`}
          />
          <button
            type="button"
            onClick={() => {
              setInput(String(Date.now()))
              setCopyStatus('')
            }}
            className={buttonClass}
          >
            Now
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <label htmlFor="ts-unit" className="block text-sm font-semibold">
            Number unit
          </label>
          <select id="ts-unit" value={unit} onChange={(event) => setUnit(event.target.value as TimeUnit)} className={`w-full ${fieldClass}`}>
            <option value="auto">Auto-detect</option>
            <option value="seconds">Seconds</option>
            <option value="milliseconds">Milliseconds</option>
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="ts-zone" className="block text-sm font-semibold">
            Time zone
          </label>
          <select id="ts-zone" value={timeZone} onChange={(event) => setTimeZone(event.target.value)} className={`w-full ${fieldClass}`}>
            {timeZones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="ts-locale" className="block text-sm font-semibold">
            Regional format
          </label>
          <select id="ts-locale" value={locale} onChange={(event) => setLocale(event.target.value)} className={`w-full ${fieldClass}`}>
            {LOCALES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-edge bg-panel p-3 text-sm">
          {error}
        </p>
      )}

      {details && (
        <section aria-labelledby="ts-results" className="space-y-2">
          <h2 id="ts-results" className="text-sm font-semibold">
            Result ({details.interpretedAs === 'date' ? 'read as a date' : `read as ${details.interpretedAs}`})
          </h2>
          <dl className="divide-y divide-edge rounded-md border border-edge bg-panel">
            {rows.map((row) => (
              <div key={row.label} className="flex flex-wrap items-center justify-between gap-2 p-3">
                <dt className="text-sm text-muted">{row.label}</dt>
                <dd className="flex items-center gap-2">
                  <span className="font-mono text-sm">{row.value}</span>
                  <button type="button" onClick={() => void copy(row.value)} aria-label={`Copy ${row.label}`} className={buttonClass}>
                    Copy
                  </button>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <p role="status" className="min-h-5 text-sm text-muted">
        {copyStatus}
      </p>

      <p className="text-sm text-muted">Converted locally in your browser. Nothing is stored or sent anywhere.</p>
    </div>
  )
}
