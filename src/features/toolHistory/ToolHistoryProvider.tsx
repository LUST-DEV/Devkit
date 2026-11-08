import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { tools } from '../../tools/registry'
import { MAX_RECENTS, pushRecent, sanitizeIds, toggleId } from './history'

const FAVORITES_KEY = 'devkit.favorites'
const RECENTS_KEY = 'devkit.recents'
const RECENTS_ENABLED_KEY = 'devkit.recentsEnabled'

const VALID_IDS = tools.map((tool) => tool.id)

interface ToolHistoryValue {
  favorites: readonly string[]
  recents: readonly string[]
  recentsEnabled: boolean
  toggleFavorite: (id: string) => void
  recordVisit: (id: string) => void
  clearRecents: () => void
  setRecentsEnabled: (enabled: boolean) => void
}

const noop = () => {
  // No provider: nothing is remembered.
}

// Without a provider the context is empty and inert, so components stay usable in isolation.
const ToolHistoryContext = createContext<ToolHistoryValue>({
  favorites: [],
  recents: [],
  recentsEnabled: true,
  toggleFavorite: noop,
  recordVisit: noop,
  clearRecents: noop,
  setRecentsEnabled: noop,
})

function readList(key: string, max: number): string[] {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? [] : sanitizeIds(JSON.parse(raw) as unknown, VALID_IDS, max)
  } catch {
    return []
  }
}

function readRecentsEnabled(): boolean {
  try {
    return window.localStorage.getItem(RECENTS_ENABLED_KEY) !== 'false'
  } catch {
    return true
  }
}

function writeItem(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Storage unavailable: the choice applies for this session only.
  }
}

function removeItem(key: string) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Storage unavailable.
  }
}

// Stores tool ids only, on this device. Never what the user types.
export function ToolHistoryProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => readList(FAVORITES_KEY, VALID_IDS.length))
  const [recentsEnabled, setRecentsEnabledState] = useState<boolean>(readRecentsEnabled)
  const [recents, setRecents] = useState<string[]>(() => (readRecentsEnabled() ? readList(RECENTS_KEY, MAX_RECENTS) : []))

  useEffect(() => {
    writeItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    writeItem(RECENTS_ENABLED_KEY, String(recentsEnabled))
  }, [recentsEnabled])

  useEffect(() => {
    if (recentsEnabled) {
      writeItem(RECENTS_KEY, JSON.stringify(recents))
    } else {
      removeItem(RECENTS_KEY)
    }
  }, [recents, recentsEnabled])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((current) => toggleId(current, id))
  }, [])

  const recordVisit = useCallback(
    (id: string) => {
      if (recentsEnabled) {
        setRecents((current) => pushRecent(current, id))
      }
    },
    [recentsEnabled],
  )

  const clearRecents = useCallback(() => {
    setRecents([])
  }, [])

  const setRecentsEnabled = useCallback((enabled: boolean) => {
    setRecentsEnabledState(enabled)
    if (!enabled) {
      setRecents([])
    }
  }, [])

  const value = useMemo<ToolHistoryValue>(
    () => ({ favorites, recents, recentsEnabled, toggleFavorite, recordVisit, clearRecents, setRecentsEnabled }),
    [favorites, recents, recentsEnabled, toggleFavorite, recordVisit, clearRecents, setRecentsEnabled],
  )

  return <ToolHistoryContext.Provider value={value}>{children}</ToolHistoryContext.Provider>
}

export function useToolHistory(): ToolHistoryValue {
  return useContext(ToolHistoryContext)
}
