import { GuidedTour } from './GuidedTour'
import type { TourControls } from './GuidedTour'
import { IntroSplash } from './IntroSplash'
import { useOnboarding } from './OnboardingProvider'
import './onboarding.css'

export function Onboarding({ controls }: { controls: TourControls }) {
  const { introActive, finishIntro } = useOnboarding()
  return (
    <>
      {introActive && <IntroSplash onDone={finishIntro} />}
      <GuidedTour controls={controls} />
    </>
  )
}
