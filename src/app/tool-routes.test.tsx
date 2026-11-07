import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { App } from './App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('implemented tool routes', () => {
  it('renders the UUID tool instead of the placeholder', async () => {
    renderAt('/tools/uuid')
    expect(await screen.findByRole('heading', { name: 'UUID Generator' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Generate' })).toBeInTheDocument()
    expect(screen.queryByText('This tool is not implemented yet.')).not.toBeInTheDocument()
  })

  it('renders the Hash tool instead of the placeholder', async () => {
    renderAt('/tools/hash')
    expect(await screen.findByRole('heading', { name: 'Hash Generator' })).toBeInTheDocument()
    expect(screen.getByLabelText('Input')).toBeInTheDocument()
    expect(screen.queryByText('This tool is not implemented yet.')).not.toBeInTheDocument()
  })
})
