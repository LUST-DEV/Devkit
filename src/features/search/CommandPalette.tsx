import { Search } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { ENTRIES } from './entries'
import { filterEntries } from './search'
import type { SearchEntry } from './search'

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const results = useMemo(() => filterEntries(ENTRIES, query), [query])
  const active = Math.min(activeIndex, Math.max(results.length - 1, 0))

  // Focus the field on open and give the focus back to the previous element on close.
  useEffect(() => {
    const previous = document.activeElement
    inputRef.current?.focus()
    return () => {
      if (previous instanceof HTMLElement) {
        previous.focus()
      }
    }
  }, [])

  useEffect(() => {
    document.getElementById(`${listId}-${active}`)?.scrollIntoView?.({ block: 'nearest' })
  }, [active, listId])

  function select(entry: SearchEntry) {
    navigate(entry.route)
    onClose()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex(results.length === 0 ? 0 : (active + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex(results.length === 0 ? 0 : (active - 1 + results.length) % results.length)
    } else if (event.key === 'Enter' && event.target === inputRef.current) {
      const entry = results[active]
      if (entry) {
        event.preventDefault()
        select(entry)
      }
    } else if (event.key === 'Tab') {
      // Keep the focus inside the dialog: it only has the field and the close button.
      event.preventDefault()
      const next = document.activeElement === inputRef.current ? closeRef.current : inputRef.current
      next?.focus()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overscroll-contain bg-black/60 p-4 pt-[12vh]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={onKeyDown}
        className="glass page-enter w-full max-w-lg overflow-hidden rounded-2xl"
      >
        <div className="flex items-center gap-3 border-b border-edge px-4 focus-within:shadow-[inset_0_-2px_0_var(--accent2)]">
          <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-muted" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
            aria-autocomplete="list"
            aria-label="Search tools and pages"
            placeholder="Search tools and pages"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
            }}
            autoComplete="off"
            spellCheck={false}
            className="min-h-14 w-full bg-transparent text-base outline-none"
          />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="grid h-11 min-w-11 place-items-center rounded-lg border border-edge px-2 text-xs text-muted hover:bg-edge"
          >
            Esc
          </button>
        </div>

        {results.length > 0 ? (
          <ul id={listId} role="listbox" aria-label="Results" className="max-h-[50vh] overflow-y-auto overscroll-contain p-2">
            {results.map((entry, index) => (
              <li
                key={`${entry.group}-${entry.id}`}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === active}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => select(entry)}
                className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 ${index === active ? 'bg-accent text-white' : ''}`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{entry.title}</span>
                  <span className={`block truncate text-xs ${index === active ? 'text-white/80' : 'text-muted'}`}>{entry.description}</span>
                </span>
                <span className={`shrink-0 text-xs ${index === active ? 'text-white/80' : 'text-muted'}`}>{entry.group}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p role="status" className="p-4 text-sm text-muted">
            No results for &quot;{query}&quot;
          </p>
        )}
      </div>
    </div>
  )
}
