import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from './App'

function renderSettings() {
  return render(
    <MemoryRouter initialEntries={['/settings']}>
      <App />
    </MemoryRouter>,
  )
}

describe('visual effects setting', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('offers the three effects levels', async () => {
    renderSettings()
    expect(await screen.findByRole('radio', { name: /Minimal/ })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Balanced/ })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Premium/ })).toBeInTheDocument()
  })

  it('applies and stores the selected level', async () => {
    renderSettings()
    fireEvent.click(await screen.findByRole('radio', { name: /Premium/ }))
    expect(document.documentElement.dataset.effects).toBe('premium')
    expect(window.localStorage.getItem('devkit.effects')).toBe('premium')
  })

  it('can switch to the minimal level', async () => {
    renderSettings()
    fireEvent.click(await screen.findByRole('radio', { name: /Minimal/ }))
    expect(document.documentElement.dataset.effects).toBe('minimal')
  })
})
