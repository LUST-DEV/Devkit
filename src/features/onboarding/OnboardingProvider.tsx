import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { TOUR_STEPS } from './tourSteps'

export type TourStatus = 'pending' | 'in-progress' | 'done' | 'skipped'

interface TourState {
  status: TourStatus
  step: number
}

interface OnboardingValue {
  introActive: boolean
  tourOpen: boolean
  tourStep: number
  finishIntro: () => void
  replayIntro: () => void
  startTour: () => void
  setTourStep: (step: number) => void
  endTour: (outcome: 'done' | 'skipped') => void
}

const INTRO_KEY = 'devkit.introSeen'
const TOUR_KEY = 'devkit.tour'
const STATUSES: readonly TourStatus[] = ['pending', 'in-progress', 'done', 'skipped']

const noop = () => {
  // No provider: there is no intro and no tour.
}

// Without a provider the context is inert, so components stay usable in isolation.
const OnboardingContext = createContext<OnboardingValue>({
  introActive: false,
  tourOpen: false,
  tourStep: 0,
  finishIntro: noop,
  replayIntro: noop,
  startTour: noop,
  setTourStep: noop,
  endTour: noop,
})

function matches(query: string): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia(query).matches
}

function readIntroSeen(): boolean {
  try {
    return window.localStorage.getItem(INTRO_KEY) === 'true'
  } catch {
    return true
  }
}

function readTour(): TourState {
  const fallback: TourState = { status: 'pending', step: 0 }
  try {
    const raw = window.localStorage.getItem(TOUR_KEY)
    if (raw === null) {
      return fallback
    }
    const value = JSON.parse(raw) as { status?: unknown; step?: unknown }
    const status = STATUSES.find((candidate) => candidate === value.status)
    const step = value.step
    if (status === undefined || typeof step !== 'number' || !Number.isInteger(step) || step < 0 || step >= TOUR_STEPS.length) {
      return fallback
    }
    return { status, step }
  } catch {
    return fallback
  }
}

function writeItem(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Storage unavailable: the progress applies for this session only.
  }
}

function isActive(status: TourStatus): boolean {
  return status === 'pending' || status === 'in-progress'
}

// Keeps only whether the intro was seen and how far the tour went, on this device.
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(() => {
    // The intro is a first-visit animation. It is skipped when the system asks for reduced motion.
    const introActive = !readIntroSeen() && !matches('(prefers-reduced-motion: reduce)')
    const tour = readTour()
    return { introActive, tour, tourOpen: !introActive && isActive(tour.status) }
  })
  const [introActive, setIntroActive] = useState(initial.introActive)
  const [tour, setTour] = useState<TourState>(initial.tour)
  const [tourOpen, setTourOpen] = useState(initial.tourOpen)

  useEffect(() => {
    writeItem(TOUR_KEY, JSON.stringify(tour))
  }, [tour])

  const tourStatus = tour.status

  const finishIntro = useCallback(() => {
    writeItem(INTRO_KEY, 'true')
    setIntroActive(false)
    setTourOpen(isActive(tourStatus))
  }, [tourStatus])

  const replayIntro = useCallback(() => {
    setTourOpen(false)
    setIntroActive(true)
  }, [])

  const startTour = useCallback(() => {
    setTour({ status: 'in-progress', step: 0 })
    setTourOpen(true)
  }, [])

  const setTourStep = useCallback((step: number) => {
    setTour({ status: 'in-progress', step })
  }, [])

  const endTour = useCallback((outcome: 'done' | 'skipped') => {
    setTour({ status: outcome, step: 0 })
    setTourOpen(false)
  }, [])

  const value = useMemo<OnboardingValue>(
    () => ({ introActive, tourOpen, tourStep: tour.step, finishIntro, replayIntro, startTour, setTourStep, endTour }),
    [introActive, tourOpen, tour.step, finishIntro, replayIntro, startTour, setTourStep, endTour],
  )

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export function useOnboarding(): OnboardingValue {
  return useContext(OnboardingContext)
}
