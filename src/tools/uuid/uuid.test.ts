// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { generateUuids, MAX_COUNT } from './uuid'
import type { SecureRandom } from './uuid'

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

function expectValues(result: ReturnType<typeof generateUuids>): string[] {
  if (!result.ok) {
    throw new Error(`Expected success but got error: ${result.error}`)
  }
  return result.values
}

describe('generateUuids', () => {
  it('generates valid version 4 UUIDs', () => {
    const values = expectValues(generateUuids({ count: 20 }))
    expect(values).toHaveLength(20)
    for (const value of values) {
      expect(value).toMatch(UUID_V4)
    }
  })

  it('generates unique values', () => {
    const values = expectValues(generateUuids({ count: 200 }))
    expect(new Set(values).size).toBe(200)
  })

  it('supports uppercase output', () => {
    const [value] = expectValues(generateUuids({ count: 1, uppercase: true }))
    expect(value).toBe(value.toUpperCase())
    expect(value.toLowerCase()).toMatch(UUID_V4)
  })

  it('supports output without hyphens', () => {
    const [value] = expectValues(generateUuids({ count: 1, hyphens: false }))
    expect(value).toMatch(/^[0-9a-f]{32}$/)
  })

  it('accepts the limits of the allowed range', () => {
    expect(expectValues(generateUuids({ count: 1 }))).toHaveLength(1)
    expect(expectValues(generateUuids({ count: MAX_COUNT }))).toHaveLength(MAX_COUNT)
  })

  it('rejects counts outside the allowed range or not whole', () => {
    for (const count of [0, -1, MAX_COUNT + 1, 1.5, Number.NaN]) {
      expect(generateUuids({ count }).ok).toBe(false)
    }
  })

  it('builds a valid version 4 UUID from raw random bytes when randomUUID is missing', () => {
    const source = {
      getRandomValues: (array: Uint8Array) => array.fill(0),
    } as unknown as SecureRandom
    const values = expectValues(generateUuids({ count: 1, source }))
    expect(values).toEqual(['00000000-0000-4000-8000-000000000000'])
  })

  it('fails clearly when no secure random source exists', () => {
    const result = generateUuids({ count: 1, source: {} as unknown as SecureRandom })
    expect(result).toEqual({ ok: false, error: 'No secure random source is available in this browser.' })
  })
})
