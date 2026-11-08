import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { Layout } from './Layout'

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<p>Home content</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Layout', () => {
  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('renders the routed content and a skip link', () => {
    renderLayout()
    expect(screen.getByText('Home content')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
  })

  it('locks the page scroll while the mobile menu is open and releases it on Escape', () => {
    renderLayout()
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(document.body.style.overflow).toBe('')
  })

  it('closes the mobile menu with the overlay button', () => {
    renderLayout()
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(screen.queryByRole('button', { name: 'Close menu' })).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
  })

  it('opens and closes the command palette with Ctrl+K', () => {
    renderLayout()
    expect(screen.queryByRole('dialog', { name: 'Command palette' })).not.toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    expect(screen.queryByRole('dialog', { name: 'Command palette' })).not.toBeInTheDocument()
  })

  it('opens the command palette from the Cmd+K variant and from the search buttons', () => {
    renderLayout()
    fireEvent.keyDown(window, { key: 'K', metaKey: true })
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Close search' }))
    expect(screen.queryByRole('dialog', { name: 'Command palette' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Open search' }))
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument()
  })
})
