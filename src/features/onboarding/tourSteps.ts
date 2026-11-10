export type TourPrepare = 'close-all' | 'open-menu' | 'open-search'

export interface TourStep {
  id: string
  title: string
  body: string
  // The element to spotlight: the one carrying data-tour="<target>" that is visible on screen.
  target?: string
  // 'click': the user taps the spotlight and the tour moves on by itself.
  action?: 'click'
  // The user may use the spotlighted element for real (type in it, pick an option).
  interactive?: boolean
  // Opens or closes parts of the interface so the target is on screen.
  prepare?: readonly TourPrepare[]
  // Goes to this page when the step starts.
  navigateTo?: string
  // Skipped when its target is not on screen (for example the phone menu on a large screen).
  optional?: boolean
}

export const TOUR_STEPS: readonly TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to DEVKIT',
    body: 'Six developer tools in one workspace, all running in your browser. Let us take a quick tour: tap the glowing spots as we go.',
    prepare: ['close-all'],
    navigateTo: '/',
  },
  {
    id: 'menu',
    title: 'Open the menu',
    body: 'Tap the menu button to see where everything is.',
    target: 'menu',
    action: 'click',
    optional: true,
    prepare: ['close-all'],
  },
  {
    id: 'tools-link',
    title: 'Go to your tools',
    body: 'Tap Tools to see the full list.',
    target: 'nav-tools',
    action: 'click',
    prepare: ['open-menu'],
  },
  {
    id: 'favorite',
    title: 'Pin a favorite',
    body: 'Tap the star to pin a tool. Favorites show up on your dashboard.',
    target: 'favorite-first',
    action: 'click',
    navigateTo: '/tools',
    prepare: ['close-all'],
  },
  {
    id: 'open-tool',
    title: 'Open a tool',
    body: 'Tap the card to open the tool.',
    target: 'tool-first',
    action: 'click',
  },
  {
    id: 'guide',
    title: 'A guide in every tool',
    body: 'The Guide button explains how the tool works. Tap Next to continue.',
    target: 'guide',
    navigateTo: '/tools/json',
  },
  {
    id: 'search',
    title: 'Search from anywhere',
    body: 'Tap Search. With a keyboard, Ctrl+K (Cmd+K on a Mac) does the same.',
    target: 'search',
    action: 'click',
    prepare: ['close-all'],
  },
  {
    id: 'palette',
    title: 'Type to find',
    body: 'Type a tool or a page name and press Enter to open it. Esc closes the search. Tap Next to continue.',
    target: 'palette-input',
    interactive: true,
    prepare: ['open-search'],
  },
  {
    id: 'privacy',
    title: 'Private by default',
    body: 'Nothing you type is stored or sent anywhere. No account, no telemetry. Tap Next to continue.',
    target: 'privacy',
    prepare: ['close-all', 'open-menu'],
  },
  {
    id: 'settings-link',
    title: 'Make it yours',
    body: 'Tap Settings to choose your theme.',
    target: 'nav-settings',
    action: 'click',
    prepare: ['open-menu'],
  },
  {
    id: 'theme',
    title: 'Theme and effects',
    body: 'Pick light or dark, and how many visual effects you want. Tap Next to continue.',
    target: 'theme',
    interactive: true,
    navigateTo: '/settings',
    prepare: ['close-all'],
  },
  {
    id: 'done',
    title: 'You are ready',
    body: 'Each tool has its own Guide button. You can restart this tour from Help or Settings.',
    navigateTo: '/',
    prepare: ['close-all'],
  },
]
