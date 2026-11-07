import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from './App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App routing', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders the dashboard with the slogan', async () => {
    renderAt('/')
    expect(await screen.findByRole('heading', { name: 'DEVKIT' })).toBeInTheDocument()
    expect(screen.getByText('One workspace. Every developer tool.')).toBeInTheDocument()
  })

  it('lists the six MVP tools on /tools', async () => {
    renderAt('/tools')
    expect(await screen.findByRole('heading', { name: 'Tools', level: 1 })).toBeInTheDocument()
    const toolLinks = screen.getAllByRole('link').filter((link) => link.getAttribute('href')?.startsWith('/tools/'))
    expect(toolLinks).toHaveLength(6)
  })

  it('renders a tool route from the registry', async () => {
    renderAt('/tools/json')
    expect(await screen.findByRole('heading', { name: 'JSON Formatter & Validator' })).toBeInTheDocument()
  })

  it('renders the 404 page for unknown routes', async () => {
    renderAt('/does-not-exist')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('renders the 404 page for unknown tools', async () => {
    renderAt('/tools/nope')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('applies and stores the selected theme', async () => {
    renderAt('/settings')
    fireEvent.click(await screen.findByRole('radio', { name: 'Light' }))
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(window.localStorage.getItem('devkit.theme')).toBe('light')
  })
})
