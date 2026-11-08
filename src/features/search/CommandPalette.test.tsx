import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { CommandPalette } from './CommandPalette'

function CurrentPath() {
  return <p data-testid="path">{useLocation().pathname}</p>
}

function renderPalette() {
  const onClose = vi.fn()
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <CommandPalette onClose={onClose} />
              <CurrentPath />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
  return { onClose, input: screen.getByRole('combobox', { name: 'Search tools and pages' }) }
}

describe('CommandPalette', () => {
  it('focuses the search field when it opens', () => {
    const { input } = renderPalette()
    expect(input).toHaveFocus()
  })

  it('filters the results as the user types', () => {
    const { input } = renderPalette()
    fireEvent.change(input, { target: { value: 'base' } })
    expect(screen.getByRole('option', { name: /Base64/ })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /JWT/ })).not.toBeInTheDocument()
  })

  it('opens the selected result with Enter and closes', () => {
    const { input, onClose } = renderPalette()
    fireEvent.change(input, { target: { value: 'jwt' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByTestId('path')).toHaveTextContent('/tools/jwt')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('moves the selection with the arrow keys', () => {
    const { input } = renderPalette()
    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(screen.getAllByRole('option')[1]).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('opens a result when it is clicked', () => {
    const { input } = renderPalette()
    fireEvent.change(input, { target: { value: 'settings' } })
    fireEvent.click(screen.getByRole('option', { name: /Settings/ }))
    expect(screen.getByTestId('path')).toHaveTextContent('/settings')
  })

  it('closes with Escape', () => {
    const { input, onClose } = renderPalette()
    fireEvent.keyDown(input, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('says so when nothing matches', () => {
    const { input } = renderPalette()
    fireEvent.change(input, { target: { value: 'zzzz' } })
    expect(screen.getByRole('status')).toHaveTextContent('No results')
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })
})
