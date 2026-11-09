import { useEffect, useRef } from 'react'
import { useOnboarding } from './OnboardingProvider'
import { TOUR_STEPS } from './tourSteps'

const buttonBase = 'min-h-11 rounded-xl px-4 text-sm font-medium transition-colors'

export function GuidedTour() {
  const { tourOpen, tourStep, setTourStep, endTour } = useOnboarding()
  const dialogRef = useRef<HTMLDivElement>(null)
  const step = TOUR_STEPS[tourStep]
  const isFirst = tourStep === 0
  const isLast = tourStep === TOUR_STEPS.length - 1

  // Highlight the elements the current step is about.
  useEffect(() => {
    if (!tourOpen || !step.target) {
      return
    }
    const elements = Array.from(document.querySelectorAll<HTMLElement>(`[data-tour~="${step.target}"]`))
    elements.forEach((element) => element.classList.add('tour-highlight'))
    elements.find((element) => element.offsetParent !== null)?.scrollIntoView?.({ block: 'nearest' })
    return () => elements.forEach((element) => element.classList.remove('tour-highlight'))
  }, [tourOpen, step])

  // Keep the screen reader and keyboard focus on the tour when the step changes.
  useEffect(() => {
    if (tourOpen) {
      dialogRef.current?.focus()
    }
  }, [tourOpen, tourStep])

  useEffect(() => {
    if (!tourOpen) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        endTour('skipped')
        return
      }
      // Do not take the arrow keys away from a field the user is typing in.
      const target = event.target instanceof HTMLElement ? event.target : null
      if (target?.closest('input, textarea, select')) {
        return
      }
      if (event.key === 'ArrowRight') {
        if (isLast) {
          endTour('done')
        } else {
          setTourStep(tourStep + 1)
        }
      } else if (event.key === 'ArrowLeft' && !isFirst) {
        setTourStep(tourStep - 1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [tourOpen, tourStep, isFirst, isLast, setTourStep, endTour])

  if (!tourOpen) {
    return null
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-label="Guided tour"
      aria-describedby="tour-body"
      tabIndex={-1}
      className="glass page-enter fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 mx-auto max-w-md space-y-3 rounded-2xl p-4 outline-none"
    >
      <p className="text-xs text-muted">
        Step {tourStep + 1} of {TOUR_STEPS.length}
      </p>
      <h2 className="text-lg font-semibold">{step.title}</h2>
      <p id="tour-body" className="text-sm text-muted">
        {step.body}
      </p>
      <div aria-hidden="true" className="flex gap-1.5">
        {TOUR_STEPS.map((item, index) => (
          <span key={item.id} className={`h-1.5 w-6 rounded-full ${index === tourStep ? 'bg-accent2' : 'bg-edge'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between gap-2">
        <button type="button" onClick={() => endTour('skipped')} className={`${buttonBase} text-muted hover:bg-edge hover:text-fg`}>
          Skip tour
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => setTourStep(tourStep - 1)}
            className={`${buttonBase} border border-edge hover:bg-edge disabled:opacity-50`}
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => (isLast ? endTour('done') : setTourStep(tourStep + 1))}
            className={`${buttonBase} bg-accent text-white`}
          >
            {isLast ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
