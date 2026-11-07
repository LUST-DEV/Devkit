import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HashTool } from './HashTool'

vi.mock('./hash', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./hash')>()
  return {
    ...actual,
    hashText: vi.fn(async (_input: string, algorithm: string) => ({ ok: true as const, value: `mock-${algorithm}` })),
  }
})

describe('HashTool', () => {
  it('shows the hash for the default algorithm', async () => {
    render(<HashTool />)
    fireEvent.change(screen.getByLabelText('Input'), { target: { value: 'abc' } })
    await waitFor(() => expect(screen.getByLabelText('Output')).toHaveValue('mock-SHA-256'))
  })

  it('recomputes when the algorithm changes', async () => {
    render(<HashTool />)
    fireEvent.change(screen.getByLabelText('Input'), { target: { value: 'abc' } })
    fireEvent.click(screen.getByRole('radio', { name: 'SHA-512' }))
    await waitFor(() => expect(screen.getByLabelText('Output')).toHaveValue('mock-SHA-512'))
  })

  it('clears the output when the input is emptied', async () => {
    render(<HashTool />)
    const input = screen.getByLabelText('Input')
    fireEvent.change(input, { target: { value: 'abc' } })
    await waitFor(() => expect(screen.getByLabelText('Output')).toHaveValue('mock-SHA-256'))
    fireEvent.change(input, { target: { value: '' } })
    await waitFor(() => expect(screen.getByLabelText('Output')).toHaveValue(''))
  })
})
