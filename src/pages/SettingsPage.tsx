import { useTheme } from '../features/theme/ThemeProvider'
import type { EffectsMode, ThemeMode } from '../features/theme/ThemeProvider'

const themeOptions: readonly { value: ThemeMode; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
]

const effectsOptions: readonly { value: EffectsMode; label: string; hint: string }[] = [
  { value: 'minimal', label: 'Minimal', hint: 'Solid surfaces, no blur or glow. Best for low-end devices.' },
  { value: 'balanced', label: 'Balanced', hint: 'Light glass effect. Default.' },
  { value: 'premium', label: 'Premium', hint: 'Stronger blur and soft glow.' },
]

export function SettingsPage() {
  const { mode, setMode, effects, setEffects } = useTheme()
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

      <fieldset className="glass space-y-1 rounded-2xl p-5">
        <legend className="px-1 text-lg font-semibold">Theme</legend>
        {themeOptions.map((option) => (
          <label key={option.value} className="flex items-center gap-3 text-sm">
            <input
              type="radio"
              name="theme"
              value={option.value}
              checked={mode === option.value}
              onChange={() => setMode(option.value)}
              className="h-5 w-5 accent-accent"
            />
            {option.label}
          </label>
        ))}
      </fieldset>

      <fieldset className="glass space-y-1 rounded-2xl p-5">
        <legend className="px-1 text-lg font-semibold">Visual effects</legend>
        {effectsOptions.map((option) => (
          <label key={option.value} className="flex items-start gap-3 py-1 text-sm">
            <input
              type="radio"
              name="effects"
              value={option.value}
              checked={effects === option.value}
              onChange={() => setEffects(option.value)}
              className="mt-0.5 h-5 w-5 accent-accent"
            />
            <span>
              <span className="block font-medium">{option.label}</span>
              <span className="block text-muted">{option.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>
    </div>
  )
}
