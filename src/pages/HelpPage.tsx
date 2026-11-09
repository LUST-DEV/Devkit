import { useOnboarding } from '../features/onboarding/OnboardingProvider'

const shortcuts: readonly { keys: string; action: string }[] = [
  { keys: 'Ctrl+K or Cmd+K', action: 'Open the search' },
  { keys: 'Esc', action: 'Close the search, a dialog or the menu' },
  { keys: 'Left and Right arrows', action: 'Move between the steps of the guided tour' },
]

export function HelpPage() {
  const { startTour } = useOnboarding()
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Help</h1>

      <section aria-labelledby="help-tour" className="glass space-y-3 rounded-2xl p-5">
        <h2 id="help-tour" className="text-lg font-semibold">
          Guided tour
        </h2>
        <p className="text-sm text-muted">A short walk through the workspace. Each tool also has a Guide button.</p>
        <button type="button" onClick={startTour} className="min-h-11 rounded-xl bg-accent px-4 text-sm font-medium text-white">
          Start the guided tour
        </button>
      </section>

      <section aria-labelledby="help-shortcuts" className="glass space-y-3 rounded-2xl p-5">
        <h2 id="help-shortcuts" className="text-lg font-semibold">
          Keyboard shortcuts
        </h2>
        <dl className="divide-y divide-edge text-sm">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.keys} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <dt className="font-mono">{shortcut.keys}</dt>
              <dd className="text-muted">{shortcut.action}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="text-sm text-muted">The FAQ and the full documentation are not available yet.</p>
    </div>
  )
}
