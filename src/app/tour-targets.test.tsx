import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { OnboardingProvider } from '../features/onboarding/OnboardingProvider'
import { TOUR_STEPS } from '../features/onboarding/tourSteps'

// For every spotlight target of the tour: the page to show and what to wait for.
const PLACES: Record<string, { route: string; heading: string | RegExp; level?: number }> = {
  menu: { route: '/', heading: 'DEVKIT' },
  'nav-tools': { route: '/', heading: 'DEVKIT' },
  'nav-settings': { route: '/', heading: 'DEVKIT' },
  search: { route: '/', heading: 'DEVKIT' },
  privacy: { route: '/', heading: 'DEVKIT' },
  'favorite-first': { route: '/tools', heading: 'Tools', level: 1 },
  'tool-first': { route: '/tools', heading: 'Tools', level: 1 },
  guide: { route: '/tools/json', heading: 'JSON Formatter & Validator' },
  theme: { route: '/settings', heading: 'Settings' },
  'palette-input': { route: '/', heading: 'DEVKIT' },
}

const TARGETS = [...new Set(TOUR_STEPS.flatMap((step) => (step.target ? [step.target] : [])))]

describe('guided tour targets', () => {
  it('knows where to find every target of the tour', () => {
    for (const target of TARGETS) {
      expect(PLACES[target], `no place registered for "${target}"`).toBeDefined()
    }
  })

  for (const target of TARGETS) {
    it(`has an element for "${target}" in the real interface`, async () => {
      window.localStorage.clear()
      window.localStorage.setItem('devkit.introSeen', 'true')
      window.localStorage.setItem('devkit.tour', JSON.stringify({ status: 'done', step: 0 }))
      const place = PLACES[target]
      render(
        <OnboardingProvider>
          <MemoryRouter initialEntries={[place.route]}>
            <App />
          </MemoryRouter>
        </OnboardingProvider>,
      )
      await screen.findByRole('heading', { name: place.heading, level: place.level })
      if (target === 'palette-input') {
        fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
      }
      expect(document.querySelector(`[data-tour~="${target}"]`), `no element for "${target}"`).not.toBeNull()
    })
  }
})
