export type UuidResult = { ok: true; values: string[] } | { ok: false; error: string }

export type SecureRandom = Pick<Crypto, 'getRandomValues'> & Partial<Pick<Crypto, 'randomUUID'>>

export interface UuidOptions {
  count: number
  uppercase?: boolean
  hyphens?: boolean
  source?: SecureRandom
}

export const MIN_COUNT = 1
export const MAX_COUNT = 1000

function generateOne(source: SecureRandom): string {
  if (typeof source.randomUUID === 'function') {
    return source.randomUUID()
  }
  const bytes = new Uint8Array(16)
  source.getRandomValues(bytes)
  // RFC 4122 version 4 and variant bits.
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export function generateUuids(options: UuidOptions): UuidResult {
  const { count, uppercase = false, hyphens = true } = options

  if (!Number.isInteger(count) || count < MIN_COUNT || count > MAX_COUNT) {
    return { ok: false, error: `Enter a whole number between ${MIN_COUNT} and ${MAX_COUNT}.` }
  }

  const source: SecureRandom | undefined = options.source ?? globalThis.crypto
  if (!source || (typeof source.randomUUID !== 'function' && typeof source.getRandomValues !== 'function')) {
    return { ok: false, error: 'No secure random source is available in this browser.' }
  }

  const values: string[] = []
  for (let index = 0; index < count; index += 1) {
    let value = generateOne(source)
    if (!hyphens) {
      value = value.replace(/-/g, '')
    }
    if (uppercase) {
      value = value.toUpperCase()
    }
    values.push(value)
  }
  return { ok: true, values }
}
