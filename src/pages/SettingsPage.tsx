import { useTheme } from '../features/theme/ThemeProvider'
import type { ThemeMode } from '../features/theme/ThemeProvider'

const options: readonly { value: ThemeMode; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
]

export function SettingsPage() {
  const { mode, setMode } = useTheme()
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <fieldset className="space-y-2">
        <legend className="mb-2 text-lg font-semibold">Theme</legend>
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-3 text-sm">
            <input
              type="radio"
              name="theme"
              value={option.value}
              checked={mode === option.value}
              onChange={() => setMode(option.value)}
              className="h-4 w-4 accent-accent"
            />
            {option.label}
          </label>
        ))}
      </fieldset>
    </div>
  )
}
