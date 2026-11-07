export type Base64Result = { ok: true; value: string } | { ok: false; error: string }

export const MAX_INPUT_LENGTH = 5_000_000

const BASE64_PATTERN = /^[A-Za-z0-9+/]*={0,2}$/

function tooLarge(): Base64Result {
  return { ok: false, error: `Input is too large (maximum ${MAX_INPUT_LENGTH.toLocaleString('en-US')} characters).` }
}

function bytesToBinary(bytes: Uint8Array): string {
  const chunkSize = 0x8000
  let binary = ''
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  }
  return binary
}

export function encodeBase64(input: string, options: { urlSafe?: boolean } = {}): Base64Result {
  if (input.length > MAX_INPUT_LENGTH) {
    return tooLarge()
  }
  const bytes = new TextEncoder().encode(input)
  let encoded = btoa(bytesToBinary(bytes))
  if (options.urlSafe) {
    encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  }
  return { ok: true, value: encoded }
}

export function decodeBase64(input: string): Base64Result {
  if (input.length > MAX_INPUT_LENGTH) {
    return tooLarge()
  }

  // Accept both the standard and the URL-safe alphabets, and ignore whitespace.
  const normalized = input.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/')

  if (!BASE64_PATTERN.test(normalized)) {
    return { ok: false, error: 'Invalid Base64: the input contains characters outside the Base64 alphabet.' }
  }

  const withoutPadding = normalized.replace(/=+$/, '')
  const paddingLength = normalized.length - withoutPadding.length
  const remainder = withoutPadding.length % 4

  if (remainder === 1) {
    return { ok: false, error: 'Invalid Base64: the input length is not valid.' }
  }

  const expectedPadding = remainder === 0 ? 0 : 4 - remainder
  if (paddingLength !== 0 && paddingLength !== expectedPadding) {
    return { ok: false, error: 'Invalid Base64: the padding is incorrect.' }
  }

  let binary: string
  try {
    binary = atob(withoutPadding + '='.repeat(expectedPadding))
  } catch {
    return { ok: false, error: 'Invalid Base64: the input could not be decoded.' }
  }

  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
  try {
    return { ok: true, value: new TextDecoder('utf-8', { fatal: true }).decode(bytes) }
  } catch {
    return { ok: false, error: 'The decoded data is not valid UTF-8 text.' }
  }
}
