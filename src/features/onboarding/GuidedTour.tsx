import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useOnboarding } from './OnboardingProvider'
import { TOUR_STEPS } from './tourSteps'

export interface TourControls {
  openDrawer: () => void
  closeAll: () => void
  openSearch: () => void
}

interface Box {
  top: number
  left: number
  width: number
  height: number
}

const PADDING = 6
const ADVANCE_DELAY_MS = 250
const POLL_MS = 120

const buttonBase = 'min-h-11 rounded-xl px-4 text-sm font-medium transition-colors'

function findTarget(target: string): HTMLElement | null {
  for (const element of document.querySelectorAll<HTMLElement>(`[data-tour~="${target}"]`)) {
    const box = element.getBoundingClientRect()
    if (box.width > 0 && box.height > 0) {
      return element
    }
  }
  return null
}

function measure(element: HTMLElement | null): Box | null {
  if (!element) {
    return null
  }
  const { top, left, width, height } = element.getBoundingClientRect()
  return { top, left, width, height }
}

function sameBox(a: Box | null, b: Box | null): boolean {
  if (a === null || b === null) {
    return a === b
  }
  return Math.abs(a.top - b.top) < 0.5 && Math.abs(a.left - b.left) < 0.5 && Math.abs(a.width - b.width) < 0.5 && Math.abs(a.height - b.height) < 0.5
}

// A game-style tour: the page is blurred except for the spotlighted element, and the user taps it to move on.
export function GuidedTour({ controls }: { controls: TourControls }) {
  const { tourOpen, tourStep, setTourStep, endTour } = useOnboarding()
  const navigate = useNavigate()
  const location = useLocation()
  const [box, setBox] = useState<Box | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const directionRef = useRef<1 | -1>(1)
  const controlsRef = useRef(controls)
  const navigateRef = useRef(navigate)
  const pathRef = useRef(location.pathname)

  useEffect(() => {
    controlsRef.current = controls
    navigateRef.current = navigate
    pathRef.current = location.pathname
  })

  const step = TOUR_STEPS[tourStep]
  const isFirst = tourStep === 0
  const isLast = tourStep === TOUR_STEPS.length - 1

  const goTo = useCallback(
    (index: number, direction: 1 | -1) => {
      directionRef.current = direction
      if (index >= TOUR_STEPS.length) {
        endTour('done')
      } else if (index >= 0) {
        setTourStep(index)
      }
    },
    [endTour, setTourStep],
  )
  const next = useCallback(() => goTo(tourStep + 1, 1), [goTo, tourStep])
  const back = useCallback(() => goTo(tourStep - 1, -1), [goTo, tourStep])

  // When a step starts: open or close what it needs, go to its page, bring its target into view.
  useEffect(() => {
    if (!tourOpen) {
      return
    }
    const current = TOUR_STEPS[tourStep]
    for (const action of current.prepare ?? []) {
      if (action === 'close-all') {
        controlsRef.current.closeAll()
      } else if (action === 'open-menu') {
        // The menu button only exists on small screens: on a large screen the menu is always open.
        if (findTarget('menu')) {
          controlsRef.current.openDrawer()
        }
      } else {
        controlsRef.current.openSearch()
      }
    }
    if (current.navigateTo && pathRef.current !== current.navigateTo) {
      navigateRef.current(current.navigateTo)
    }
    if (current.target) {
      findTarget(current.target)?.scrollIntoView?.({ block: 'center' })
    } else {
      dialogRef.current?.focus()
    }
  }, [tourOpen, tourStep])

  // Skip a step whose target is not on this screen, in the direction the user was going.
  useEffect(() => {
    if (!tourOpen) {
      return
    }
    const current = TOUR_STEPS[tourStep]
    if (current.optional && current.target && !findTarget(current.target)) {
      goTo(tourStep + directionRef.current, directionRef.current)
    }
  }, [tourOpen, tourStep, goTo])

  // Follow the target while the page scrolls, resizes or animates.
  useEffect(() => {
    if (!tourOpen) {
      return
    }
    const target = TOUR_STEPS[tourStep].target
    if (!target) {
      setBox(null)
      return
    }
    const update = () => {
      const measured = measure(findTarget(target))
      setBox((previous) => (sameBox(previous, measured) ? previous : measured))
    }
    update()
    const interval = window.setInterval(update, POLL_MS)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [tourOpen, tourStep])

  // A tap on the spotlighted element moves the tour on, after what the tap does has happened.
  useEffect(() => {
    if (!tourOpen) {
      return
    }
    const current = TOUR_STEPS[tourStep]
    if (current.action !== 'click' || !current.target) {
      return
    }
    const target = current.target
    let timer: number | undefined
    const onClick = (event: MouseEvent) => {
      const element = findTarget(target)
      if (element && event.target instanceof Node && element.contains(event.target)) {
        window.clearTimeout(timer)
        timer = window.setTimeout(() => goTo(tourStep + 1, 1), ADVANCE_DELAY_MS)
      }
    }
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.clearTimeout(timer)
    }
  }, [tourOpen, tourStep, goTo])

  useEffect(() => {
    if (!tourOpen) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Another dialog (the search) may already have used this Escape.
        if (!event.defaultPrevented) {
          endTour('skipped')
        }
        return
      }
      // Do not take the arrow keys away from a field the user is typing in.
      const target = event.target instanceof HTMLElement ? event.target : null
      if (target?.closest('input, textarea, select')) {
        return
      }
      if (event.key === 'ArrowRight') {
        next()
      } else if (event.key === 'ArrowLeft' && !isFirst) {
        back()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [tourOpen, isFirst, next, back, endTour])

  if (!tourOpen) {
    return null
  }

  const hole = box
    ? {
        top: Math.max(0, box.top - PADDING),
        left: Math.max(0, box.left - PADDING),
        right: box.left + box.width + PADDING,
        bottom: box.top + box.height + PADDING,
      }
    : null

  const veils: CSSProperties[] = hole
    ? [
        { top: 0, left: 0, right: 0, height: hole.top },
        { top: hole.bottom, left: 0, right: 0, bottom: 0 },
        { top: hole.top, left: 0, width: hole.left, height: hole.bottom - hole.top },
        { top: hole.top, left: hole.right, right: 0, height: hole.bottom - hole.top },
      ]
    : [{ top: 0, left: 0, right: 0, bottom: 0 }]

  const placement = !box ? 'center' : box.top + box.height / 2 < window.innerHeight / 2 ? 'bottom' : 'top'
  const placementClass =
    placement === 'center'
      ? 'top-1/2 -translate-y-1/2'
      : placement === 'bottom'
        ? 'bottom-[max(0.75rem,env(safe-area-inset-bottom))]'
        : 'top-[max(0.75rem,env(safe-area-inset-top))]'

  const isClickStep = step.action === 'click'
  const guardsTarget = Boolean(hole) && !isClickStep && !step.interactive

  return (
    <>
      {veils.map((style, index) => (
        <div key={index} data-testid="tour-veil" aria-hidden="true" className="tour-veil fixed z-[54]" style={style} />
      ))}
      {hole && (
        <div
          data-testid="tour-ring"
          aria-hidden="true"
          className="tour-ring pointer-events-none fixed z-[55] rounded-2xl"
          style={{ top: hole.top, left: hole.left, width: hole.right - hole.left, height: hole.bottom - hole.top }}
        />
      )}
      {guardsTarget && hole && (
        <div
          data-testid="tour-hole-guard"
          aria-hidden="true"
          className="fixed z-[55]"
          style={{ top: hole.top, left: hole.left, width: hole.right - hole.left, height: hole.bottom - hole.top }}
        />
      )}

      <div
        ref={dialogRef}
        role="dialog"
        aria-label="Guided tour"
        aria-describedby="tour-body"
        tabIndex={-1}
        className={`glass page-enter fixed inset-x-3 z-[56] mx-auto max-w-md space-y-3 rounded-2xl p-4 outline-none ${placementClass}`}
      >
        <p className="text-xs text-muted">
          Step {tourStep + 1} of {TOUR_STEPS.length}
        </p>
        <h2 className="text-lg font-semibold">{step.title}</h2>
        <p id="tour-body" className="text-sm text-muted">
          {step.body}
        </p>
        {isClickStep && (
          <p className="text-xs text-accent2">
            {hole ? 'Tap the glowing spot to continue.' : 'This is not on the screen right now. You can skip this step.'}
          </p>
        )}
        <div aria-hidden="true" className="flex gap-1">
          {TOUR_STEPS.map((item, index) => (
            <span key={item.id} className={`h-1.5 flex-1 rounded-full ${index === tourStep ? 'bg-accent2' : 'bg-edge'}`} />
          ))}
        </div>
        <div className="flex items-center justify-between gap-2">
          <button type="button" onClick={() => endTour('skipped')} className={`${buttonBase} text-muted hover:bg-edge hover:text-fg`}>
            Skip tour
          </button>
          <div className="flex gap-2">
            <button type="button" disabled={isFirst} onClick={back} className={`${buttonBase} border border-edge hover:bg-edge disabled:opacity-50`}>
              Back
            </button>
            <button type="button" onClick={next} className={`${buttonBase} bg-accent text-white`}>
              {isLast ? 'Finish' : isClickStep ? 'Skip this step' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
