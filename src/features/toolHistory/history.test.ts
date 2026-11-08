// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { MAX_RECENTS, pushRecent, sanitizeIds, toggleId } from './history'

const VALID = ['json', 'base64', 'uuid', 'jwt', 'hash', 'timestamp']

describe('sanitizeIds', () => {
  it('keeps known unique ids in order', () => {
    expect(sanitizeIds(['json', 'uuid', 'json'], VALID, 10)).toEqual(['json', 'uuid'])
  })

  it('drops unknown ids and values that are not strings', () => {
    expect(sanitizeIds(['json', 'nope', 42, null, {}], VALID, 10)).toEqual(['json'])
  })

  it('returns an empty list when the value is not an array', () => {
    expect(sanitizeIds('json', VALID, 10)).toEqual([])
    expect(sanitizeIds(null, VALID, 10)).toEqual([])
    expect(sanitizeIds({ 0: 'json' }, VALID, 10)).toEqual([])
  })

  it('respects the maximum', () => {
    expect(sanitizeIds(VALID, VALID, 3)).toEqual(['json', 'base64', 'uuid'])
  })
})

describe('pushRecent', () => {
  it('puts the newest tool first', () => {
    expect(pushRecent(['json'], 'uuid')).toEqual(['uuid', 'json'])
  })

  it('moves an already listed tool to the front without duplicating it', () => {
    expect(pushRecent(['json', 'uuid', 'jwt'], 'jwt')).toEqual(['jwt', 'json', 'uuid'])
  })

  it('keeps at most five tools by default', () => {
    let recents: string[] = []
    for (const id of VALID) {
      recents = pushRecent(recents, id)
    }
    expect(recents).toHaveLength(MAX_RECENTS)
    expect(recents[0]).toBe('timestamp')
    expect(recents).not.toContain('json')
  })
})

describe('toggleId', () => {
  it('adds an id that is missing and removes one that is present', () => {
    expect(toggleId([], 'json')).toEqual(['json'])
    expect(toggleId(['json', 'uuid'], 'json')).toEqual(['uuid'])
  })
})
