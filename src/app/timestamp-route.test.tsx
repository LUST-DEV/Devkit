import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { tools } from '../tools/registry'

describe('Timestamp route', () => {
  it('renders the Timestamp tool instead of the placeholder', async () => {
    render(
      <MemoryRouter initialEntries={['/tools/timestamp']}>
        <App />
      </MemoryRouter>,
    )
    expect(await screen.findByRole('heading', { name: 'Timestamp Converter' })).toBeInTheDocument()
    expect(screen.getByLabelText('Timestamp or date')).toBeInTheDocument()
    expect(screen.queryByText('This tool is not implemented yet.')).not.toBeInTheDocument()
  })
})

describe('MVP completeness', () => {
  it('marks all six MVP tools as available', () => {
    expect(tools).toHaveLength(6)
    expect(tools.every((tool) => tool.availability === 'available')).toBe(true)
  })
})
