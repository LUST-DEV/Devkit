// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { decodeBase64, encodeBase64, MAX_INPUT_LENGTH } from './base64'

function expectOk(result: ReturnType<typeof encodeBase64>): string {
  if (!result.ok) {
    throw new Error(`Expected success but got error: ${result.error}`)
  }
  return result.value
}

describe('encodeBase64', () => {
  it('encodes ASCII text', () => {
    expect(expectOk(encodeBase64('hello'))).toBe('aGVsbG8=')
  })

  it('encodes an empty string to an empty string', () => {
    expect(expectOk(encodeBase64(''))).toBe('')
  })

  it('encodes Unicode text as UTF-8', () => {
    expect(expectOk(encodeBase64('\u2713'))).toBe('4pyT')
  })

  it('uses the standard alphabet by default', () => {
    expect(expectOk(encodeBase64('>>>'))).toBe('Pj4+')
    expect(expectOk(encodeBase64('???'))).toBe('Pz8/')
  })

  it('supports the URL-safe alphabet without padding', () => {
    expect(expectOk(encodeBase64('>>>', { urlSafe: true }))).toBe('Pj4-')
    expect(expectOk(encodeBase64('???', { urlSafe: true }))).toBe('Pz8_')
    expect(expectOk(encodeBase64('hello', { urlSafe: true }))).toBe('aGVsbG8')
  })

  it('rejects input above the size limit', () => {
    const result = encodeBase64('a'.repeat(MAX_INPUT_LENGTH + 1))
    expect(result.ok).toBe(false)
  })
})

describe('decodeBase64', () => {
  it('decodes ASCII text', () => {
    expect(expectOk(decodeBase64('aGVsbG8='))).toBe('hello')
  })

  it('decodes Unicode text', () => {
    expect(expectOk(decodeBase64('4pyT'))).toBe('\u2713')
  })

  it('round-trips mixed Unicode text', () => {
    const text = 'h\u00e9llo \u2713 \u{1F600} \u65e5\u672c\u8a9e'
    expect(expectOk(decodeBase64(expectOk(encodeBase64(text))))).toBe(text)
    expect(expectOk(decodeBase64(expectOk(encodeBase64(text, { urlSafe: true }))))).toBe(text)
  })

  it('accepts missing padding', () => {
    expect(expectOk(decodeBase64('aGVsbG8'))).toBe('hello')
  })

  it('accepts the URL-safe alphabet', () => {
    expect(expectOk(decodeBase64('Pj4-'))).toBe('>>>')
    expect(expectOk(decodeBase64('Pz8_'))).toBe('???')
  })

  it('ignores whitespace and line breaks', () => {
    expect(expectOk(decodeBase64('aGVs\nbG8=\n'))).toBe('hello')
    expect(expectOk(decodeBase64('  aGVs bG8=  '))).toBe('hello')
  })

  it('decodes an empty string to an empty string', () => {
    expect(expectOk(decodeBase64(''))).toBe('')
  })

  it('rejects characters outside the alphabet', () => {
    const result = decodeBase64('a$b=')
    expect(result).toEqual({
      ok: false,
      error: 'Invalid Base64: the input contains characters outside the Base64 alphabet.',
    })
  })

  it('rejects an impossible length', () => {
    const result = decodeBase64('a')
    expect(result).toEqual({ ok: false, error: 'Invalid Base64: the input length is not valid.' })
  })

  it('rejects incorrect padding', () => {
    expect(decodeBase64('aGVsbG8==').ok).toBe(false)
    expect(decodeBase64('aGVsbG8===').ok).toBe(false)
  })

  it('rejects padding in the middle', () => {
    expect(decodeBase64('aG=Vs').ok).toBe(false)
  })

  it('reports data that is not valid UTF-8 text', () => {
    const result = decodeBase64('/w==')
    expect(result).toEqual({ ok: false, error: 'The decoded data is not valid UTF-8 text.' })
  })

  it('rejects input above the size limit', () => {
    const result = decodeBase64('A'.repeat(MAX_INPUT_LENGTH + 1))
    expect(result.ok).toBe(false)
  })
})
