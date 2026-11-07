export type JsonResult = { ok: true; value: string } | { ok: false; error: string }

export type IndentOption = '2' | '4' | 'tab'

export const MAX_INPUT_LENGTH = 5_000_000

type ParseOutcome = { ok: true; value: unknown } | { ok: false; error: string }

export function positionToLineColumn(text: string, position: number): { line: number; column: number } {
  const lines = text.slice(0, position).split('\n')
  return { line: lines.length, column: lines[lines.length - 1].length + 1 }
}

function parseJson(input: string): ParseOutcome {
  if (input.length > MAX_INPUT_LENGTH) {
    return { ok: false, error: `Input is too large (maximum ${MAX_INPUT_LENGTH.toLocaleString('en-US')} characters).` }
  }
  if (input.trim() === '') {
    return { ok: false, error: 'The input is empty.' }
  }
  try {
    return { ok: true, value: JSON.parse(input) as unknown }
  } catch (error) {
    const message = (error instanceof Error ? error.message : 'unknown error').slice(0, 200)
    const match = /position (\d+)/.exec(message)
    if (match) {
      const { line, column } = positionToLineColumn(input, Number(match[1]))
      return { ok: false, error: `Invalid JSON at line ${line}, column ${column}: ${message}` }
    }
    return { ok: false, error: `Invalid JSON: ${message}` }
  }
}

export function formatJson(input: string, indent: IndentOption = '2'): JsonResult {
  const parsed = parseJson(input)
  if (!parsed.ok) {
    return parsed
  }
  return { ok: true, value: JSON.stringify(parsed.value, null, indent === 'tab' ? '\t' : Number(indent)) }
}

export function minifyJson(input: string): JsonResult {
  const parsed = parseJson(input)
  if (!parsed.ok) {
    return parsed
  }
  return { ok: true, value: JSON.stringify(parsed.value) }
}
