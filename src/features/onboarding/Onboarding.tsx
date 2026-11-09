import { GuidedTour } from './GuidedTour'
import { IntroSplash } from './IntroSplash'
import { useOnboarding } from './OnboardingProvider'
import './onboarding.css'

export function Onboarding() {
  const { introActive, finishIntro } = useOnboarding()
  return (
    <>
      {introActive && <IntroSplash onDone={finishIntro} />}
      <GuidedTour />
    </>
  )
}
