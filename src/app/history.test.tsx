import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { ToolHistoryProvider } from '../features/toolHistory/ToolHistoryProvider'
import { App } from './App'

function renderAt(path: string) {
  return render(
    <ToolHistoryProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </ToolHistoryProvider>,
  )
}

describe('favorites and recent tools', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('toggles a favorite and stores only its id', async () => {
    renderAt('/tools')
    const button = await screen.findByRole('button', { name: 'Favorite JSON Formatter & Validator' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(window.localStorage.getItem('devkit.favorites')).toBe('["json"]')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(window.localStorage.getItem('devkit.favorites')).toBe('[]')
  })

  it('records an opened tool as recent, by name only', async () => {
    renderAt('/tools/base64')
    await screen.findByRole('heading', { name: 'Base64 Encoder / Decoder' })
    expect(window.localStorage.getItem('devkit.recents')).toBe('["base64"]')
  })

  it('does not remember anything when recent tools are turned off', async () => {
    renderAt('/settings')
    fireEvent.click(await screen.findByRole('checkbox', { name: /Remember recently used tools/ }))
    expect(window.localStorage.getItem('devkit.recentsEnabled')).toBe('false')
    expect(window.localStorage.getItem('devkit.recents')).toBeNull()
  })

  it('clears the recent tools', async () => {
    window.localStorage.setItem('devkit.recents', JSON.stringify(['json', 'uuid']))
    renderAt('/settings')
    fireEvent.click(await screen.findByRole('button', { name: 'Clear recent tools' }))
    expect(window.localStorage.getItem('devkit.recents')).toBe('[]')
  })
})
