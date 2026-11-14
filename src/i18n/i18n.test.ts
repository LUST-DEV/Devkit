// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { getToolGuide } from '../features/onboarding/toolGuides'
import { TOUR_STEPS } from '../features/onboarding/tourSteps'
import { tools } from '../tools/registry'
import { DICTIONARIES, LOCALES, detectLocale, format, isLocale, isMessageKey, translate } from './i18n'
import type { Locale, MessageKey } from './i18n'
import { en } from './messages.en'

const KEYS = Object.keys(en) as MessageKey[]
const OTHER_LOCALES: Locale[] = ['fr', 'es']

function placeholders(text: string): string[] {
  return [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort()
}

describe('detectLocale', () => {
  it('picks the first supported language of the list', () => {
    expect(detectLocale(['fr-FR', 'en-US'])).toBe('fr')
    expect(detectLocale(['de-DE', 'es-MX', 'fr'])).toBe('es')
    expect(detectLocale(['EN-us'])).toBe('en')
  })

  it('falls back to English', () => {
    expect(detectLocale(['de-DE', 'ja'])).toBe('en')
    expect(detectLocale([])).toBe('en')
  })
})

describe('format', () => {
  it('fills the placeholders and keeps the unknown ones', () => {
    expect(format('Step {n} of {total}', { n: 2, total: 12 })).toBe('Step 2 of 12')
    expect(format('Hello {name}', {})).toBe('Hello {name}')
    expect(format('No placeholder')).toBe('No placeholder')
  })
})

describe('helpers', () => {
  it('recognises locales and message keys', () => {
    expect(isLocale('fr')).toBe(true)
    expect(isLocale('de')).toBe(false)
    expect(isLocale(null)).toBe(false)
    expect(isMessageKey('nav.tools')).toBe(true)
    expect(isMessageKey('nav.unknown')).toBe(false)
    expect(isMessageKey('toString')).toBe(false)
  })

  it('translates with parameters', () => {
    expect(translate('en', 'tour.stepOf', { n: 3, total: 12 })).toBe('Step 3 of 12')
    expect(translate('fr', 'tour.stepOf', { n: 3, total: 12 })).toBe('\u00c9tape 3 sur 12')
    expect(translate('es', 'tool.favorite', { name: 'X' })).toBe('Favorito: X')
  })

  it('lists every language with its own name', () => {
    expect(LOCALES.map((locale) => locale.label)).toEqual(['English', 'Fran\u00e7ais', 'Espa\u00f1ol'])
  })
})

describe('dictionaries', () => {
  for (const locale of OTHER_LOCALES) {
    it(`${locale} has exactly the keys of English`, () => {
      expect(Object.keys(DICTIONARIES[locale]).sort()).toEqual([...KEYS].sort())
    })

    it(`${locale} has no empty text`, () => {
      for (const key of KEYS) {
        expect(DICTIONARIES[locale][key].trim().length, `${locale}: ${key}`).toBeGreaterThan(0)
      }
    })

    it(`${locale} uses the same placeholders as English`, () => {
      for (const key of KEYS) {
        expect(placeholders(DICTIONARIES[locale][key]), `${locale}: ${key}`).toEqual(placeholders(en[key]))
      }
    })
  }

  it('translates something in every language (the slogan and the language names aside)', () => {
    const brand = new Set<MessageKey>(['home.slogan', 'intro.line1'])
    for (const locale of OTHER_LOCALES) {
      const same = KEYS.filter((key) => DICTIONARIES[locale][key] === en[key] && !brand.has(key))
      // A few texts are identical on purpose (Premium, Guide, Minimal...). Most must differ.
      expect(same.length, `${locale}: too many untranslated texts: ${same.join(', ')}`).toBeLessThan(12)
    }
  })
})

describe('texts that live in other modules', () => {
  it('matches the name and the description of every tool in the registry', () => {
    for (const tool of tools) {
      expect(en[`tool.${tool.id}.name` as MessageKey]).toBe(tool.name)
      expect(en[`tool.${tool.id}.description` as MessageKey]).toBe(tool.description)
    }
  })

  it('has a translation of every tour step, and English matches the tour data', () => {
    for (const step of TOUR_STEPS) {
      expect(en[`tour.step.${step.id}.title` as MessageKey]).toBe(step.title)
      expect(en[`tour.step.${step.id}.body` as MessageKey]).toBe(step.body)
    }
  })

  it('has a translation of every tip of every tool guide, and English matches the guide data', () => {
    for (const tool of tools) {
      getToolGuide(tool.id).forEach((tip, index) => {
        expect(en[`guide.${tool.id}.${index}` as MessageKey]).toBe(tip)
      })
    }
  })
})
