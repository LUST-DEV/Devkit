export interface TimeClaim {
  claim: 'exp' | 'iat' | 'nbf'
  seconds: number
  iso: string
  status: string | null
}

export type JwtResult =
  | {
      ok: true
      headerText: string
      payloadText: string
      algorithm: string | null
      hasSignature: boolean
      timeClaims: TimeClaim[]
      warnings: string[]
    }
  | { ok: false; error: string }

type SegmentResult = { ok: true; value: Record<string, unknown> } | { ok: false; error: string }

export const MAX_INPUT_LENGTH = 100_000

const BASE64URL_PATTERN = /^[A-Za-z0-9_-]+$/

function decodeSegment(segment: string, label: string): SegmentResult {
  if (segment === '') {
    return { ok: false, error: `The ${label} is empty.` }
  }
  if (!BASE64URL_PATTERN.test(segment)) {
    return { ok: false, error: `The ${label} is not valid Base64URL.` }
  }
  const remainder = segment.length % 4
  if (remainder === 1) {
    return { ok: false, error: `The ${label} has an invalid length.` }
  }

  let text: string
  try {
    const normalized = segment.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - remainder) % 4)
    const binary = atob(normalized)
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    return { ok: false, error: `The ${label} could not be decoded as UTF-8 text.` }
  }

  let value: unknown
  try {
    value = JSON.parse(text)
  } catch {
    return { ok: false, error: `The ${label} is not valid JSON.` }
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return { ok: false, error: `The ${label} must be a JSON object.` }
  }
  return { ok: true, value: value as Record<string, unknown> }
}

function describeTimeClaims(payload: Record<string, unknown>, now: number): TimeClaim[] {
  const claims: TimeClaim[] = []
  for (const claim of ['exp', 'iat', 'nbf'] as const) {
    const seconds = payload[claim]
    if (typeof seconds !== 'number' || !Number.isFinite(seconds)) {
      continue
    }
    const date = new Date(seconds * 1000)
    if (Number.isNaN(date.getTime())) {
      continue
    }
    let status: string | null = null
    if (claim === 'exp') {
      status = now >= seconds * 1000 ? 'Expired' : 'Not expired'
    } else if (claim === 'nbf') {
      status = now < seconds * 1000 ? 'Not yet valid' : 'Already valid'
    }
    claims.push({ claim, seconds, iso: date.toISOString(), status })
  }
  return claims
}

// Decodes the header and payload of a JWT. It never verifies the signature.
export function decodeJwt(input: string, now: number = Date.now()): JwtResult {
  if (input.length > MAX_INPUT_LENGTH) {
    return { ok: false, error: `Input is too large (maximum ${MAX_INPUT_LENGTH.toLocaleString('en-US')} characters).` }
  }
  const token = input.replace(/^\s*Bearer\s+/i, '').replace(/\s+/g, '')
  if (token === '') {
    return { ok: false, error: 'Enter a JWT.' }
  }

  const parts = token.split('.')
  if (parts.length !== 3) {
    return { ok: false, error: `A JWT has three parts separated by dots (found ${parts.length}).` }
  }

  const header = decodeSegment(parts[0], 'header')
  if (!header.ok) {
    return header
  }
  const payload = decodeSegment(parts[1], 'payload')
  if (!payload.ok) {
    return payload
  }

  const algorithm = typeof header.value.alg === 'string' ? header.value.alg : null
  const hasSignature = parts[2] !== ''
  const warnings: string[] = []
  if (algorithm !== null && algorithm.toLowerCase() === 'none') {
    warnings.push('The header declares the algorithm "none": this token is unsigned.')
  }
  if (!hasSignature) {
    warnings.push('The token has no signature part.')
  }

  return {
    ok: true,
    headerText: JSON.stringify(header.value, null, 2),
    payloadText: JSON.stringify(payload.value, null, 2),
    algorithm,
    hasSignature,
    timeClaims: describeTimeClaims(payload.value, now),
    warnings,
  }
}
