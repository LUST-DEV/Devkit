export interface SearchEntry {
  id: string
  title: string
  description: string
  group: 'Tools' | 'Pages'
  route: string
  keywords: readonly string[]
}

export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

// Local, instant search. Every word of the query must match somewhere in the entry.
export function filterEntries(entries: readonly SearchEntry[], query: string, limit = 8): SearchEntry[] {
  const tokens = normalize(query).split(/\s+/).filter(Boolean)
  if (tokens.length === 0) {
    return entries.slice(0, limit)
  }

  const scored: { entry: SearchEntry; score: number; index: number }[] = []
  entries.forEach((entry, index) => {
    const title = normalize(entry.title)
    const description = normalize(entry.description)
    const keywords = entry.keywords.map(normalize)
    let total = 0
    for (const token of tokens) {
      let score = 0
      if (title.startsWith(token)) {
        score = 4
      } else if (title.includes(token)) {
        score = 3
      } else if (keywords.some((keyword) => keyword.includes(token))) {
        score = 2
      } else if (description.includes(token)) {
        score = 1
      }
      if (score === 0) {
        return
      }
      total += score
    }
    scored.push({ entry, score: total, index })
  })

  return scored
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((item) => item.entry)
}
