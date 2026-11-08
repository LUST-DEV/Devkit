import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { tools } from '../tools/registry'
import { HomePage } from './HomePage'

function renderHome() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )
}

describe('HomePage', () => {
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
})
