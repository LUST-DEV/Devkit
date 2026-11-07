// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { formatJson, MAX_INPUT_LENGTH, minifyJson, positionToLineColumn } from './json'

function expectOk(result: ReturnType<typeof formatJson>): string {
  if (!result.ok) {
    throw new Error(`Expected success but got error: ${result.error}`)
  }
  return result.value
}

describe('formatJson', () => {
  it('formats with two spaces by default', () => {
    expect(expectOk(formatJson('{"a":1,"b":[1,2]}'))).toBe('{\n  "a": 1,\n  "b": [\n    1,\n    2\n  ]\n}')
  })

  it('supports four spaces and tabs', () => {
    expect(expectOk(formatJson('{"a":1}', '4'))).toBe('{\n    "a": 1\n}')
    expect(expectOk(formatJson('{"a":1}', 'tab'))).toBe('{\n\t"a": 1\n}')
  })

  it('formats primitive values', () => {
    expect(expectOk(formatJson('123'))).toBe('123')
    expect(expectOk(formatJson('"text"'))).toBe('"text"')
    expect(expectOk(formatJson('null'))).toBe('null')
  })

  it('preserves Unicode text', () => {
    expect(expectOk(formatJson('{"name":"h\u00e9llo \u2713"}'))).toBe('{\n  "name": "h\u00e9llo \u2713"\n}')
  })

  it('reports invalid JSON with an explicit message', () => {
    for (const input of ['{"a":1,}', '[1,]', "{'a':1}", '{"a" 1}', 'nope']) {
      const result = formatJson(input)
      expect(result.ok).toBe(false)
      if (!result.ok) {
        expect(result.error).toMatch(/^Invalid JSON/)
      }
    }
  })

  it('reports an empty input', () => {
    expect(formatJson('')).toEqual({ ok: false, error: 'The input is empty.' })
    expect(formatJson('   \n ')).toEqual({ ok: false, error: 'The input is empty.' })
  })

  it('rejects input above the size limit', () => {
    expect(formatJson(' '.repeat(MAX_INPUT_LENGTH + 1)).ok).toBe(false)
  })
})

describe('minifyJson', () => {
  it('removes insignificant whitespace', () => {
    expect(expectOk(minifyJson('{\n  "a": 1,\n  "b": [1, 2]\n}'))).toBe('{"a":1,"b":[1,2]}')
  })

  it('reports invalid JSON', () => {
    expect(minifyJson('{').ok).toBe(false)
  })
})

describe('positionToLineColumn', () => {
  it('converts a character position to a line and column', () => {
    const text = '{\n  "a": 1,\n  oops\n}'
    expect(positionToLineColumn(text, 14)).toEqual({ line: 3, column: 3 })
    expect(positionToLineColumn(text, 0)).toEqual({ line: 1, column: 1 })
  })
})
