import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Layout } from '../../components/Layout'
import { Onboarding } from './Onboarding'
import { OnboardingProvider } from './OnboardingProvider'
import { TOUR_STEPS } from './tourSteps'

function renderOnboarding() {
  return render(
    <OnboardingProvider>
      <Onboarding />
    </OnboardingProvider>,
  )
}

function markIntroSeen() {
  window.localStorage.setItem('devkit.introSeen', 'true')
}

function storedTour(): { status: string; step: number } {
  return JSON.parse(window.localStorage.getItem('devkit.tour') ?? 'null') as { status: string; step: number }
}

const intro = () => screen.queryByRole('dialog', { name: 'Welcome to DEVKIT' })
const tour = () => screen.queryByRole('dialog', { name: 'Guided tour' })

describe('intro', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('shows the intro on the first visit for 5 seconds, then starts the tour', () => {
    renderOnboarding()
    expect(intro()).toBeInTheDocument()
    expect(tour()).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(4999)
    })
    expect(intro()).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(intro()).not.toBeInTheDocument()
    expect(tour()).toBeInTheDocument()
    expect(window.localStorage.getItem('devkit.introSeen')).toBe('true')
  })

  it('can be skipped with the button', () => {
    renderOnboarding()
    fireEvent.click(screen.getByRole('button', { name: 'Skip intro' }))
    expect(intro()).not.toBeInTheDocument()
    expect(tour()).toBeInTheDocument()
  })

  it('can be skipped with Escape', () => {
    renderOnboarding()
    fireEvent.keyDown(screen.getByRole('button', { name: 'Skip intro' }), { key: 'Escape' })
    expect(intro()).not.toBeInTheDocument()
  })

  it('is not shown again to a returning visitor', () => {
    markIntroSeen()
    window.localStorage.setItem('devkit.tour', JSON.stringify({ status: 'done', step: 0 }))
    renderOnboarding()
    expect(intro()).not.toBeInTheDocument()
    expect(tour()).not.toBeInTheDocument()
  })

  it('is skipped when the system asks for reduced motion, but the tour still starts', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }))
    renderOnboarding()
    expect(intro()).not.toBeInTheDocument()
    expect(tour()).toBeInTheDocument()
  })
})

describe('guided tour', () => {
  beforeEach(() => {
    window.localStorage.clear()
    markIntroSeen()
  })

  it('starts at the first step and moves forward and back', () => {
    renderOnboarding()
    expect(screen.getByText(`Step 1 of ${TOUR_STEPS.length}`)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText(`Step 2 of ${TOUR_STEPS.length}`)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: TOUR_STEPS[1].title })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByText(`Step 1 of ${TOUR_STEPS.length}`)).toBeInTheDocument()
  })

  it('can be skipped, and remembers it', () => {
    renderOnboarding()
    fireEvent.click(screen.getByRole('button', { name: 'Skip tour' }))
    expect(tour()).not.toBeInTheDocument()
    expect(storedTour().status).toBe('skipped')
  })

  it('finishes on the last step, and remembers it', () => {
    window.localStorage.setItem('devkit.tour', JSON.stringify({ status: 'in-progress', step: TOUR_STEPS.length - 1 }))
    renderOnboarding()
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }))
    expect(tour()).not.toBeInTheDocument()
    expect(storedTour().status).toBe('done')
  })

  it('resumes where the user stopped', () => {
    window.localStorage.setItem('devkit.tour', JSON.stringify({ status: 'in-progress', step: 2 }))
    renderOnboarding()
    expect(screen.getByText(`Step 3 of ${TOUR_STEPS.length}`)).toBeInTheDocument()
  })

  it('stores the progress', () => {
    renderOnboarding()
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(storedTour()).toEqual({ status: 'in-progress', step: 1 })
  })

  it('ignores a stored progress that is not valid', () => {
    window.localStorage.setItem('devkit.tour', JSON.stringify({ status: 'in-progress', step: 99 }))
    renderOnboarding()
    expect(screen.getByText(`Step 1 of ${TOUR_STEPS.length}`)).toBeInTheDocument()
  })

  it('works with the keyboard', () => {
    renderOnboarding()
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText(`Step 2 of ${TOUR_STEPS.length}`)).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByText(`Step 1 of ${TOUR_STEPS.length}`)).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(tour()).not.toBeInTheDocument()
    expect(storedTour().status).toBe('skipped')
  })

  it('does not take the arrow keys away from a text field', () => {
    render(
      <OnboardingProvider>
        <input aria-label="field" />
        <Onboarding />
      </OnboardingProvider>,
    )
    fireEvent.keyDown(screen.getByLabelText('field'), { key: 'ArrowRight' })
    expect(screen.getByText(`Step 1 of ${TOUR_STEPS.length}`)).toBeInTheDocument()
  })

  it('highlights, in the real layout, the element each step talks about', () => {
    for (const [index, step] of TOUR_STEPS.entries()) {
      if (!step.target) {
        continue
      }
      window.localStorage.setItem('devkit.tour', JSON.stringify({ status: 'in-progress', step: index }))
      const { unmount } = render(
        <MemoryRouter initialEntries={['/']}>
          <OnboardingProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<p>Home</p>} />
              </Route>
            </Routes>
          </OnboardingProvider>
        </MemoryRouter>,
      )
      const targets = document.querySelectorAll(`[data-tour~="${step.target}"]`)
      expect(targets.length, `no element for the "${step.id}" step`).toBeGreaterThan(0)
      for (const element of targets) {
        expect(element).toHaveClass('tour-highlight')
      }
      unmount()
      expect(document.querySelectorAll('.tour-highlight')).toHaveLength(0)
    }
  })
})
