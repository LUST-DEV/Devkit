import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'

export const INTRO_DURATION_MS = 5000

const LINES = ['One workspace. Every developer tool.', 'Local-first: your data never leaves your browser.', 'No account. No telemetry.']

interface IntroSplashProps {
  onDone: () => void
  durationMs?: number
}

// A short branded intro, shown on the first visit only. It can always be skipped.
export function IntroSplash({ onDone, durationMs = INTRO_DURATION_MS }: IntroSplashProps) {
  const doneRef = useRef(onDone)
  const skipRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    doneRef.current = onDone
  })

  useEffect(() => {
    skipRef.current?.focus()
    const timer = window.setTimeout(() => doneRef.current(), durationMs)
    return () => window.clearTimeout(timer)
  }, [durationMs])

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onDone()
    } else if (event.key === 'Tab') {
      event.preventDefault()
      skipRef.current?.focus()
    }
  }

  const lineDuration = durationMs / LINES.length

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to DEVKIT"
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[60] grid place-content-center justify-items-center gap-8 bg-app px-6 text-center text-fg"
      style={{ backgroundImage: 'radial-gradient(40rem 30rem at 50% 30%, var(--glow-a), transparent 65%)' }}
    >
      <div className="relative grid h-24 w-24 place-items-center">
        <span aria-hidden="true" className="intro-orbit absolute inset-0 rounded-full border-2 border-transparent border-r-accent border-t-accent2" />
        <span aria-hidden="true" className="h-3 w-3 rounded-full bg-accent2 shadow-[0_0_20px_var(--accent2)]" />
      </div>
      <p className="text-4xl font-bold tracking-tight">DEVKIT</p>
      <div className="relative h-14 w-full max-w-md">
        {LINES.map((line, index) => (
          <p
            key={line}
            className="intro-line absolute inset-0 grid place-content-center text-lg text-muted"
            style={{ animationDuration: `${lineDuration}ms`, animationDelay: `${lineDuration * index}ms` }}
          >
            {line}
          </p>
        ))}
      </div>
      <div className="h-1.5 w-56 overflow-hidden rounded-full bg-edge">
        <div className="intro-progress h-full rounded-full bg-accent2" style={{ animationDuration: `${durationMs}ms` }} />
      </div>
      <button
        ref={skipRef}
        type="button"
        onClick={onDone}
        className="min-h-11 rounded-xl border border-edge px-5 text-sm font-medium text-muted transition-colors hover:bg-edge hover:text-fg"
      >
        Skip intro
      </button>
    </div>
  )
}
