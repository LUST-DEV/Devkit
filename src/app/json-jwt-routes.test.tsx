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

describe('JSON and JWT routes', () => {
  it('renders the JSON tool instead of the placeholder', async () => {
    renderAt('/tools/json')
    expect(await screen.findByRole('heading', { name: 'JSON Formatter & Validator' })).toBeInTheDocument()
    expect(screen.getByLabelText('Input')).toBeInTheDocument()
    expect(screen.queryByText('This tool is not implemented yet.')).not.toBeInTheDocument()
  })

  it('renders the JWT tool instead of the placeholder', async () => {
    renderAt('/tools/jwt')
    expect(await screen.findByRole('heading', { name: 'JWT Decoder' })).toBeInTheDocument()
    expect(screen.getByLabelText('Token')).toBeInTheDocument()
    expect(screen.queryByText('This tool is not implemented yet.')).not.toBeInTheDocument()
  })
})
