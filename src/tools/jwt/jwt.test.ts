// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { decodeJwt } from './jwt'

function b64url(value: unknown): string {
  const text = typeof value === 'string' ? value : JSON.stringify(value)
  return btoa(String.fromCharCode(...new TextEncoder().encode(text)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function token(header: unknown, payload: unknown, signature = 'c2lnbmF0dXJl'): string {
  return `${b64url(header)}.${b64url(payload)}.${signature}`
}

const NOW = Date.UTC(2026, 0, 1)

function expectOk(result: ReturnType<typeof decodeJwt>) {
  if (!result.ok) {
    throw new Error(`Expected success but got error: ${result.error}`)
  }
  return result
}

describe('decodeJwt', () => {
  it('decodes the header and the payload', () => {
    const result = expectOk(decodeJwt(token({ alg: 'HS256', typ: 'JWT' }, { sub: '1234567890', name: 'John Doe' }), NOW))
    expect(JSON.parse(result.headerText)).toEqual({ alg: 'HS256', typ: 'JWT' })
    expect(JSON.parse(result.payloadText)).toEqual({ sub: '1234567890', name: 'John Doe' })
    expect(result.algorithm).toBe('HS256')
    expect(result.hasSignature).toBe(true)
    expect(result.warnings).toEqual([])
  })

  it('decodes Unicode claims', () => {
    const result = expectOk(decodeJwt(token({ alg: 'HS256' }, { name: 'h\u00e9llo \u2713' }), NOW))
    expect(JSON.parse(result.payloadText)).toEqual({ name: 'h\u00e9llo \u2713' })
  })

  it('accepts a Bearer prefix and surrounding whitespace', () => {
    const value = token({ alg: 'HS256' }, { a: 1 })
    expectOk(decodeJwt(`Bearer ${value}`, NOW))
    expectOk(decodeJwt(`  ${value}\n`, NOW))
  })

  it('rejects a token without three parts', () => {
    const result = decodeJwt('abc.def', NOW)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toContain('three parts')
    }
  })

  it('rejects an empty input', () => {
    expect(decodeJwt('   ', NOW)).toEqual({ ok: false, error: 'Enter a JWT.' })
  })

  it('rejects a part that is not valid Base64URL', () => {
    expect(decodeJwt(`a$b.${b64url({ a: 1 })}.sig`, NOW).ok).toBe(false)
  })

  it('rejects a part that is not JSON', () => {
    expect(decodeJwt(`${b64url('not json')}.${b64url({ a: 1 })}.sig`, NOW).ok).toBe(false)
  })

  it('rejects a payload that is not a JSON object', () => {
    expect(decodeJwt(`${b64url({ alg: 'HS256' })}.${b64url('123')}.sig`, NOW).ok).toBe(false)
    expect(decodeJwt(`${b64url({ alg: 'HS256' })}.${b64url('[1]')}.sig`, NOW).ok).toBe(false)
  })

  it('warns about unsigned tokens', () => {
    const result = expectOk(decodeJwt(token({ alg: 'none' }, { a: 1 }, ''), NOW))
    expect(result.hasSignature).toBe(false)
    expect(result.warnings).toHaveLength(2)
  })

  it('describes time claims and their status', () => {
    const result = expectOk(decodeJwt(token({ alg: 'HS256' }, { iat: 1516239022, exp: 1516239022, nbf: 4102444800 }), NOW))
    const byClaim = Object.fromEntries(result.timeClaims.map((claim) => [claim.claim, claim]))
    expect(byClaim.iat.iso).toBe('2018-01-18T01:30:22.000Z')
    expect(byClaim.iat.status).toBeNull()
    expect(byClaim.exp.status).toBe('Expired')
    expect(byClaim.nbf.status).toBe('Not yet valid')
  })

  it('reports a token that has not expired', () => {
    const result = expectOk(decodeJwt(token({ alg: 'HS256' }, { exp: 4102444800 }), NOW))
    expect(result.timeClaims[0].iso).toBe('2100-01-01T00:00:00.000Z')
    expect(result.timeClaims[0].status).toBe('Not expired')
  })

  it('ignores time claims that are not valid numbers', () => {
    const result = expectOk(decodeJwt(token({ alg: 'HS256' }, { exp: 'soon', iat: 1e30 }), NOW))
    expect(result.timeClaims).toEqual([])
  })
})
