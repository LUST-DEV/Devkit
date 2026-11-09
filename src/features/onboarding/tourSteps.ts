export interface TourStep {
  id: string
  title: string
  body: string
  // Matches elements carrying data-tour="<target>" (a space separated list of targets is allowed).
  target?: string
}

export const TOUR_STEPS: readonly TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to DEVKIT',
    body: 'Six developer tools in one workspace. Everything runs in your browser, so your data never leaves your device.',
  },
  {
    id: 'search',
    title: 'Find anything fast',
    body: 'Press Ctrl+K (Cmd+K on a Mac) or use the Search button to jump to any tool or page.',
    target: 'search',
  },
  {
    id: 'tools',
    title: 'Your tools',
    body: 'The Tools page lists every tool. Tap the star on a card to pin a favorite. On a phone, open the menu first.',
    target: 'tools',
  },
  {
    id: 'privacy',
    title: 'Private by default',
    body: 'Nothing you type is stored or sent anywhere. No account, no telemetry.',
    target: 'privacy',
  },
  {
    id: 'settings',
    title: 'Make it yours',
    body: 'Choose a light or dark theme and the level of visual effects in Settings.',
    target: 'settings',
  },
  {
    id: 'done',
    title: 'You are ready',
    body: 'Each tool has a short Guide button. You can restart this tour at any time from Help or Settings.',
  },
]
