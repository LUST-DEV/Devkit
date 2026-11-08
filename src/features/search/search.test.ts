// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { filterEntries, normalize } from './search'
import type { SearchEntry } from './search'

function entry(id: string, title: string, description = '', keywords: string[] = []): SearchEntry {
  return { id, title, description, group: 'Tools', route: `/tools/${id}`, keywords }
}

const ENTRIES = [
  entry('json', 'JSON Formatter', 'Format and validate JSON', ['data']),
  entry('jwt', 'JWT Decoder', 'Inspect a token', ['security']),
  entry('hash', 'Hash Generator', 'Compute SHA hashes', ['security']),
  entry('cafe', 'Caf\u00e9 Menu', 'A drink list'),
]

describe('normalize', () => {
  it('lowercases, trims and removes accents', () => {
    expect(normalize('  Caf\u00e9 \u00c9T\u00c9 ')).toBe('cafe ete')
  })
})

describe('filterEntries', () => {
  it('returns the first entries for an empty query, up to the limit', () => {
    expect(filterEntries(ENTRIES, '', 2).map((item) => item.id)).toEqual(['json', 'jwt'])
    expect(filterEntries(ENTRIES, '   ')).toHaveLength(ENTRIES.length)
  })

  it('matches the title', () => {
    expect(filterEntries(ENTRIES, 'hash').map((item) => item.id)).toEqual(['hash'])
  })

  it('matches keywords such as a category', () => {
    expect(filterEntries(ENTRIES, 'security').map((item) => item.id)).toEqual(['jwt', 'hash'])
  })

  it('matches the description', () => {
    expect(filterEntries(ENTRIES, 'token').map((item) => item.id)).toEqual(['jwt'])
  })

  it('ignores case and accents', () => {
    expect(filterEntries(ENTRIES, 'CAFE').map((item) => item.id)).toEqual(['cafe'])
    expect(filterEntries(ENTRIES, 'caf\u00e9').map((item) => item.id)).toEqual(['cafe'])
  })

  it('requires every word of the query to match', () => {
    expect(filterEntries(ENTRIES, 'json security')).toEqual([])
    expect(filterEntries(ENTRIES, 'jwt security').map((item) => item.id)).toEqual(['jwt'])
  })

  it('ranks a title match above a description match', () => {
    const entries = [entry('a', 'Other', 'mentions base64'), entry('b', 'Base64 Tool', 'encoding')]
    expect(filterEntries(entries, 'base64').map((item) => item.id)).toEqual(['b', 'a'])
  })

  it('returns nothing when no entry matches', () => {
    expect(filterEntries(ENTRIES, 'zzzz')).toEqual([])
  })
})
