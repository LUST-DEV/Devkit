import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('Base64 route', () => {
  it('renders the real Base64 tool instead of the placeholder', async () => {
    render(
      <MemoryRouter initialEntries={['/tools/base64']}>
        <App />
      </MemoryRouter>,
    )
    expect(await screen.findByRole('heading', { name: 'Base64 Encoder / Decoder' })).toBeInTheDocument()
    expect(screen.getByLabelText('Input')).toBeInTheDocument()
    expect(screen.queryByText('This tool is not implemented yet.')).not.toBeInTheDocument()
  })
})
