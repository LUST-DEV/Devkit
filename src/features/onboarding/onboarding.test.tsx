import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Onboarding } from './Onboarding'
import { OnboardingProvider } from './OnboardingProvider'
import { TOUR_STEPS } from './tourSteps'

const RECT = { x: 10, y: 10, top: 10, left: 10, right: 110, bottom: 50, width: 100, height: 40, toJSON: () => ({}) }

// jsdom has no layout: give every element a box so that targets count as visible.
function showEverything() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(RECT as DOMRect)
}

function makeControls() {
  return { openDrawer: vi.fn(), closeAll: vi.fn(), openSearch: vi.fn() }
}

const TARGETS = [...new Set(TOUR_STEPS.flatMap((step) => (step.target ? [step.target] : [])))]

function Targets() {
  return (
    <>
      {TARGETS.map((target) => (
        <button key={target} type="button" data-tour={target}>{`target ${target}`}</button>
      ))}
    </>
  )
}

function Path() {
  return <p data-testid="path">{useLocation().pathname}</p>
}

function renderTour({ fixture = true, controls = makeControls() } = {}) {
  render(
    <MemoryRouter>
      <OnboardingProvider>
        {fixture && <Targets />}
        <Onboarding controls={controls} />
        <Path />
      </OnboardingProvider>
    </MemoryRouter>,
  )
  return controls
}

const indexOf = (id: string) => TOUR_STEPS.findIndex((step) => step.id === id)
const total = TOUR_STEPS.length

function seedTour(id: string) {
  window.localStorage.setItem('devkit.tour', JSON.stringify({ status: 'in-progress', step: indexOf(id) }))
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
    renderTour({ fixture: false })
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
    renderTour({ fixture: false })
    fireEvent.click(screen.getByRole('button', { name: 'Skip intro' }))
    expect(intro()).not.toBeInTheDocument()
    expect(tour()).toBeInTheDocument()
  })

  it('can be skipped with Escape', () => {
    renderTour({ fixture: false })
    fireEvent.keyDown(screen.getByRole('button', { name: 'Skip intro' }), { key: 'Escape' })
    expect(intro()).not.toBeInTheDocument()
  })

  it('is not shown again to a returning visitor', () => {
    window.localStorage.setItem('devkit.introSeen', 'true')
    window.localStorage.setItem('devkit.tour', JSON.stringify({ status: 'done', step: 0 }))
    renderTour({ fixture: false })
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
    renderTour({ fixture: false })
    expect(intro()).not.toBeInTheDocument()
    expect(tour()).toBeInTheDocument()
  })
})

describe('guided tour', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.localStorage.setItem('devkit.introSeen', 'true')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('starts at the first step and moves forward and back', () => {
    showEverything()
    renderTour()
    expect(screen.getByText(`Step 1 of ${total}`)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByRole('heading', { name: TOUR_STEPS[1].title })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByText(`Step 1 of ${total}`)).toBeInTheDocument()
  })

  it('can be skipped, and remembers it', () => {
    renderTour()
    fireEvent.click(screen.getByRole('button', { name: 'Skip tour' }))
    expect(tour()).not.toBeInTheDocument()
    expect(storedTour().status).toBe('skipped')
  })

  it('finishes on the last step, and remembers it', () => {
    seedTour('done')
    renderTour()
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }))
    expect(tour()).not.toBeInTheDocument()
    expect(storedTour().status).toBe('done')
  })

  it('resumes where the user stopped', () => {
    seedTour('search')
    renderTour()
    expect(screen.getByText(`Step ${indexOf('search') + 1} of ${total}`)).toBeInTheDocument()
  })

  it('stores the progress', () => {
    showEverything()
    renderTour()
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(storedTour()).toEqual({ status: 'in-progress', step: 1 })
  })

  it('ignores a stored progress that is not valid', () => {
    window.localStorage.setItem('devkit.tour', JSON.stringify({ status: 'in-progress', step: 99 }))
    renderTour()
    expect(screen.getByText(`Step 1 of ${total}`)).toBeInTheDocument()
  })

  it('works with the keyboard', () => {
    showEverything()
    renderTour()
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText(`Step 2 of ${total}`)).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByText(`Step 1 of ${total}`)).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(tour()).not.toBeInTheDocument()
    expect(storedTour().status).toBe('skipped')
  })

  it('does not take the arrow keys away from a text field', () => {
    render(
      <MemoryRouter>
        <OnboardingProvider>
          <input aria-label="field" />
          <Onboarding controls={makeControls()} />
        </OnboardingProvider>
      </MemoryRouter>,
    )
    fireEvent.keyDown(screen.getByLabelText('field'), { key: 'ArrowRight' })
    expect(screen.getByText(`Step 1 of ${total}`)).toBeInTheDocument()
  })

  it('leaves an Escape that another dialog already used', () => {
    renderTour()
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    event.preventDefault()
    act(() => {
      window.dispatchEvent(event)
    })
    expect(tour()).toBeInTheDocument()
  })

  it('moves on by itself when the user taps the spotlighted element', () => {
    showEverything()
    vi.useFakeTimers()
    seedTour('tools-link')
    renderTour()
    expect(screen.getByRole('heading', { name: 'Go to your tools' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'target search' }))
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(screen.getByRole('heading', { name: 'Go to your tools' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'target nav-tools' }))
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(screen.getByRole('heading', { name: 'Pin a favorite' })).toBeInTheDocument()
  })

  it('skips a step whose target is not on the screen, going forward and back', () => {
    showEverything()
    renderTour({ fixture: false })
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText(`Step 3 of ${total}`)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByText(`Step 1 of ${total}`)).toBeInTheDocument()
  })

  it('goes to the page a step needs', () => {
    showEverything()
    seedTour('favorite')
    renderTour()
    expect(screen.getByTestId('path')).toHaveTextContent('/tools')
  })

  it('opens and closes parts of the interface for a step', () => {
    showEverything()
    seedTour('tools-link')
    const controls = renderTour()
    expect(controls.openDrawer).toHaveBeenCalled()
  })

  it('does not open the phone menu when there is no menu button on the screen', () => {
    showEverything()
    seedTour('tools-link')
    const controls = renderTour({ fixture: false })
    expect(controls.openDrawer).not.toHaveBeenCalled()
  })

  it('opens the search for the search step and closes everything on the first step', () => {
    showEverything()
    seedTour('palette')
    const controls = renderTour()
    expect(controls.openSearch).toHaveBeenCalled()
    window.localStorage.setItem('devkit.tour', JSON.stringify({ status: 'pending', step: 0 }))
    const other = renderTour()
    expect(other.closeAll).toHaveBeenCalled()
  })

  it('blurs the page except around the spotlighted element', () => {
    showEverything()
    seedTour('tools-link')
    renderTour()
    expect(screen.getAllByTestId('tour-veil')).toHaveLength(4)
    const ring = screen.getByTestId('tour-ring')
    expect(ring).toHaveStyle({ top: '4px', left: '4px', width: '112px', height: '52px' })
  })

  it('covers the whole page when a step has nothing to point at', () => {
    renderTour()
    expect(screen.getAllByTestId('tour-veil')).toHaveLength(1)
    expect(screen.queryByTestId('tour-ring')).not.toBeInTheDocument()
  })

  it('lets the user use the spotlighted element on interactive steps only', () => {
    showEverything()
    seedTour('palette')
    renderTour()
    expect(screen.queryByTestId('tour-hole-guard')).not.toBeInTheDocument()
  })

  it('protects the spotlighted element on a step where it is only shown', () => {
    showEverything()
    seedTour('privacy')
    renderTour()
    expect(screen.getByTestId('tour-hole-guard')).toBeInTheDocument()
  })
})
