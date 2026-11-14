import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { ToolDefinition } from '../tools/registry'
import { DEFAULT_LOCALE, detectLocale, format, isLocale, isMessageKey, translate } from './i18n'
import type { Locale, MessageKey, Params } from './i18n'

const STORAGE_KEY = 'devkit.locale'

interface ToolText {
  name: string
  description: string
}

interface I18nValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  // Translates a known key.
  t: (key: MessageKey, params?: Params) => string
  // Translates a key built at run time, with a fallback when the key does not exist.
  tr: (key: string, fallback: string, params?: Params) => string
  // Translated name and description of a tool.
  tool: (definition: ToolDefinition) => ToolText
}

function createValue(locale: Locale, setLocale: (locale: Locale) => void): I18nValue {
  const t = (key: MessageKey, params?: Params) => translate(locale, key, params)
  const tr = (key: string, fallback: string, params?: Params) => (isMessageKey(key) ? t(key, params) : format(fallback, params))
  const tool = (definition: ToolDefinition): ToolText => ({
    name: tr(`tool.${definition.id}.name`, definition.name),
    description: tr(`tool.${definition.id}.description`, definition.description),
  })
  return { locale, setLocale, t, tr, tool }
}

// Without a provider the interface is in English, so components stay usable in isolation.
const I18nContext = createContext<I18nValue>(
  createValue(DEFAULT_LOCALE, () => {
    // No provider: the language cannot change.
  }),
)

function browserLanguages(): readonly string[] {
  if (typeof navigator === 'undefined') {
    return []
  }
  return navigator.languages && navigator.languages.length > 0 ? navigator.languages : [navigator.language]
}

function readInitialLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) {
      return stored
    }
  } catch {
    // Storage unavailable: fall back to the browser language.
  }
  return detectLocale(browserLanguages())
}

// The language is the browser language until the user picks one. The choice is a small preference kept on the device.
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage unavailable: the choice applies for this session only.
    }
  }, [])

  const value = useMemo(() => createValue(locale, setLocale), [locale, setLocale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  return useContext(I18nContext)
}
