export const MAX_RECENTS = 5

// Keeps only known, unique ids, up to a maximum. Anything else read from storage is dropped.
export function sanitizeIds(value: unknown, validIds: readonly string[], max: number): string[] {
  if (!Array.isArray(value)) {
    return []
  }
  const result: string[] = []
  for (const item of value) {
    if (typeof item === 'string' && validIds.includes(item) && !result.includes(item)) {
      result.push(item)
    }
    if (result.length >= max) {
      break
    }
  }
  return result
}

export function pushRecent(recents: readonly string[], id: string, max: number = MAX_RECENTS): string[] {
  return [id, ...recents.filter((item) => item !== id)].slice(0, max)
}

export function toggleId(list: readonly string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id]
}
