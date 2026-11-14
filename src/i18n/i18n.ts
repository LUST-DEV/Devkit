import { en } from './messages.en'
import type { MessageKey, Messages } from './messages.en'
import { es } from './messages.es'
import { fr } from './messages.fr'

export type { MessageKey, Messages }
export type Locale = 'en' | 'fr' | 'es'
export type Params = Readonly<Record<string, string | number>>

export const DEFAULT_LOCALE: Locale = 'en'

// Language names are written in their own language, so a user can always find theirs.
export const LOCALES: readonly { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Fran\u00e7ais' },
  { code: 'es', label: 'Espa\u00f1ol' },
]

export const DICTIONARIES: Readonly<Record<Locale, Messages>> = { en, fr, es }

export function isLocale(value: unknown): value is Locale {
  return LOCALES.some((locale) => locale.code === value)
}

export function isMessageKey(key: string): key is MessageKey {
  return Object.prototype.hasOwnProperty.call(en, key)
}

// The first language of the browser list that DEVKIT speaks, English otherwise.
export function detectLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const primary = language.toLowerCase().split('-')[0]
    const match = LOCALES.find((locale) => locale.code === primary)
    if (match) {
      return match.code
    }
  }
  return DEFAULT_LOCALE
}

export function format(template: string, params?: Params): string {
  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) => {
    const value = params?.[name]
    return value === undefined ? placeholder : String(value)
  })
}

export function translate(locale: Locale, key: MessageKey, params?: Params): string {
  return format(DICTIONARIES[locale][key], params)
}
