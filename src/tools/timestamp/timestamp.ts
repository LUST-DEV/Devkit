export type TimeUnit = 'auto' | 'seconds' | 'milliseconds'

export interface TimestampDetails {
  milliseconds: number
  seconds: number
  iso: string
  zoned: string
  offset: string
  interpretedAs: 'seconds' | 'milliseconds' | 'date'
}

export type TimestampResult = { ok: true; details: TimestampDetails } | { ok: false; error: string }

export interface ConvertOptions {
  unit?: TimeUnit
  timeZone?: string
  locale?: string
}

const MAX_MS = 8.64e15
const MAX_INPUT_LENGTH = 100
const NUMERIC = /^-?\d+(\.\d+)?$/
const DATE_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?(Z|[+-]\d{2}:\d{2})?$/

export function detectTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

export function getTimeZones(): string[] {
  let zones: string[] = []
  try {
    zones = Intl.supportedValuesOf('timeZone')
  } catch {
    zones = []
  }
  return zones.includes('UTC') ? zones : ['UTC', ...zones]
}

function isKnownTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone })
    return true
  } catch {
    return false
  }
}

function safeLocale(locale: string): string {
  try {
    return Intl.DateTimeFormat.supportedLocalesOf([locale]).length > 0 ? locale : 'en-US'
  } catch {
    return 'en-US'
  }
}

// Offset of a time zone from UTC, in milliseconds, at a given instant.
export function getOffsetMs(instantMs: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(new Date(instantMs))
  const read = (type: string) => Number(parts.find((part) => part.type === type)?.value)
  const wallAsUtc = Date.UTC(read('year'), read('month') - 1, read('day'), read('hour'), read('minute'), read('second'))
  return wallAsUtc - Math.floor(instantMs / 1000) * 1000
}

// Converts a wall-clock time (expressed as if it were UTC) in a time zone to the real instant.
function wallTimeToInstant(wallMs: number, timeZone: string): number {
  const first = wallMs - getOffsetMs(wallMs, timeZone)
  return wallMs - getOffsetMs(first, timeZone)
}

function formatOffset(offsetMs: number): string {
  const sign = offsetMs < 0 ? '-' : '+'
  const totalMinutes = Math.abs(Math.round(offsetMs / 60000))
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
  const minutes = String(totalMinutes % 60).padStart(2, '0')
  return `${sign}${hours}:${minutes}`
}

function parseDate(input: string, timeZone: string): { ok: true; ms: number } | { ok: false; error: string } {
  const match = DATE_PATTERN.exec(input)
  if (!match) {
    return { ok: false, error: 'Unrecognized input. Use a number of seconds or milliseconds, or a date such as 2026-11-07 14:30:00 or 2026-11-07T14:30:00Z.' }
  }
  const [, y, mo, d, h, mi, s, frac, offset] = match
  const year = Number(y)
  const month = Number(mo)
  const day = Number(d)
  const hour = h === undefined ? 0 : Number(h)
  const minute = mi === undefined ? 0 : Number(mi)
  const second = s === undefined ? 0 : Number(s)
  const millisecond = frac === undefined ? 0 : Number(frac.padEnd(3, '0'))

  if (offset !== undefined && h === undefined) {
    return { ok: false, error: 'A time is required when an offset is given.' }
  }
  if (year < 1000) {
    return { ok: false, error: 'The year must be between 1000 and 9999.' }
  }
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth) {
    return { ok: false, error: 'This date does not exist.' }
  }
  if (hour > 23 || minute > 59 || second > 59) {
    return { ok: false, error: 'This time does not exist.' }
  }

  const wallMs = Date.UTC(year, month - 1, day, hour, minute, second, millisecond)

  if (offset === undefined) {
    return { ok: true, ms: wallTimeToInstant(wallMs, timeZone) }
  }
  if (offset === 'Z') {
    return { ok: true, ms: wallMs }
  }
  const offsetHours = Number(offset.slice(1, 3))
  const offsetMinutes = Number(offset.slice(4, 6))
  if (offsetHours > 23 || offsetMinutes > 59) {
    return { ok: false, error: 'The UTC offset is not valid.' }
  }
  const offsetMs = (offsetHours * 60 + offsetMinutes) * 60000 * (offset.startsWith('-') ? -1 : 1)
  return { ok: true, ms: wallMs - offsetMs }
}

export function convertInput(input: string, options: ConvertOptions = {}): TimestampResult {
  const { unit = 'auto', timeZone = 'UTC', locale = 'en-US' } = options
  const text = input.trim()

  if (text === '') {
    return { ok: false, error: 'Enter a timestamp or a date.' }
  }
  if (text.length > MAX_INPUT_LENGTH) {
    return { ok: false, error: `Input is too long (maximum ${MAX_INPUT_LENGTH} characters).` }
  }
  if (!isKnownTimeZone(timeZone)) {
    return { ok: false, error: 'Unknown time zone.' }
  }

  let ms: number
  let interpretedAs: TimestampDetails['interpretedAs']

  if (NUMERIC.test(text)) {
    const value = Number(text)
    interpretedAs = unit === 'auto' ? (Math.abs(value) >= 1e11 ? 'milliseconds' : 'seconds') : unit
    ms = Math.round(interpretedAs === 'seconds' ? value * 1000 : value)
  } else {
    const parsed = parseDate(text, timeZone)
    if (!parsed.ok) {
      return parsed
    }
    ms = parsed.ms
    interpretedAs = 'date'
  }

  if (!Number.isFinite(ms) || Math.abs(ms) > MAX_MS) {
    return { ok: false, error: 'The value is outside the supported date range.' }
  }

  const date = new Date(ms)
  const zoned = new Intl.DateTimeFormat(safeLocale(locale), { dateStyle: 'full', timeStyle: 'long', timeZone }).format(date)

  return {
    ok: true,
    details: {
      milliseconds: ms,
      seconds: Math.floor(ms / 1000),
      iso: date.toISOString(),
      zoned,
      offset: formatOffset(getOffsetMs(ms, timeZone)),
      interpretedAs,
    },
  }
}
