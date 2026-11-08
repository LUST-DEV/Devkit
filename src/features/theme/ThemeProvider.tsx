import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type ThemeMode = 'dark' | 'light' | 'system'
export type ResolvedTheme = 'dark' | 'light'
export type EffectsMode = 'minimal' | 'balanced' | 'premium'

const THEME_KEY = 'devkit.theme'
const EFFECTS_KEY = 'devkit.effects'

interface ThemeContextValue {
  mode: ThemeMode
  resolved: ResolvedTheme
  setMode: (mode: ThemeMode) => void
  effects: EffectsMode
  setEffects: (effects: EffectsMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function matches(query: string): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia(query).matches
}

function readStoredMode(): ThemeMode {
  try {
    const value = window.localStorage.getItem(THEME_KEY)
    if (value === 'dark' || value === 'light' || value === 'system') {
      return value
    }
  } catch {
    // Storage unavailable: fall back to the default.
  }
  return 'system'
}

function readStoredEffects(): EffectsMode {
  try {
    const value = window.localStorage.getItem(EFFECTS_KEY)
    if (value === 'minimal' || value === 'balanced' || value === 'premium') {
      return value
    }
  } catch {
    // Storage unavailable: fall back to the default.
  }
  return matches('(prefers-reduced-motion: reduce)') ? 'minimal' : 'balanced'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode)
  const [effects, setEffectsState] = useState<EffectsMode>(readStoredEffects)
  const [systemDark, setSystemDark] = useState<boolean>(() => matches('(prefers-color-scheme: dark)'))

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return
    }
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const resolved: ResolvedTheme = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode

  useEffect(() => {
    document.documentElement.dataset.theme = resolved
  }, [resolved])

  useEffect(() => {
    document.documentElement.dataset.effects = effects
  }, [effects])

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      resolved,
      setMode: (next: ThemeMode) => {
        setModeState(next)
        try {
          window.localStorage.setItem(THEME_KEY, next)
        } catch {
          // Storage unavailable: the choice applies for this session only.
        }
      },
      effects,
      setEffects: (next: EffectsMode) => {
        setEffectsState(next)
        try {
          window.localStorage.setItem(EFFECTS_KEY, next)
        } catch {
          // Storage unavailable: the choice applies for this session only.
        }
      },
    }),
    [mode, resolved, effects],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }
  return context
}
