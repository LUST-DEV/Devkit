import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { ToolHistoryProvider } from '../features/toolHistory/ToolHistoryProvider'
import { tools } from '../tools/registry'
import { HomePage } from './HomePage'

function renderHome() {
  return render(
    <MemoryRouter>
      <ToolHistoryProvider>
        <HomePage />
      </ToolHistoryProvider>
    </MemoryRouter>,
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('shows the key figures', () => {
    renderHome()
    expect(screen.getByRole('list', { name: 'Key figures' })).toBeInTheDocument()
    expect(screen.getByText('telemetry events')).toBeInTheDocument()
    expect(screen.getByText(String(tools.length))).toBeInTheDocument()
  })

  it('offers a quick access link for every tool', () => {
    renderHome()
    const quickAccess = screen.getByRole('navigation', { name: 'Quick access' })
    const links = within(quickAccess).getAllByRole('link')
    expect(links).toHaveLength(tools.length)
    expect(links.map((link) => link.getAttribute('href'))).toEqual(tools.map((tool) => tool.route))
  })

  it('hides the favorites and recent sections when they are empty', () => {
    renderHome()
    expect(screen.queryByRole('navigation', { name: 'Favorites' })).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Recent' })).not.toBeInTheDocument()
  })

  it('lists the favorite and recent tools saved on this device', () => {
    window.localStorage.setItem('devkit.favorites', JSON.stringify(['uuid']))
    window.localStorage.setItem('devkit.recents', JSON.stringify(['jwt', 'json']))
    renderHome()
    const favorites = screen.getByRole('navigation', { name: 'Favorites' })
    expect(within(favorites).getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(['/tools/uuid'])
    const recent = screen.getByRole('navigation', { name: 'Recent' })
    expect(within(recent).getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(['/tools/jwt', '/tools/json'])
  })

  it('ignores unknown or malformed values read from storage', () => {
    window.localStorage.setItem('devkit.favorites', '{not json')
    window.localStorage.setItem('devkit.recents', JSON.stringify(['nope', 42]))
    renderHome()
    expect(screen.queryByRole('navigation', { name: 'Favorites' })).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Recent' })).not.toBeInTheDocument()
  })
})
