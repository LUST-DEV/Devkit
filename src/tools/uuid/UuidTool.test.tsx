import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { UuidTool } from './UuidTool'

vi.mock('./uuid', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./uuid')>()
  return {
    ...actual,
    generateUuids: vi.fn((options: { count: number }) =>
      options.count >= 1
        ? { ok: true as const, values: Array.from({ length: options.count }, (_, index) => `id-${index + 1}`) }
        : { ok: false as const, error: 'bad count' },
    ),
  }
})

describe('UuidTool', () => {
  it('generates the requested number of values', () => {
    render(<UuidTool />)
    fireEvent.change(screen.getByLabelText('Number of UUIDs'), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Generate' }))
    expect(screen.getByLabelText('Output')).toHaveValue('id-1\nid-2')
  })

  it('shows an explicit error for an invalid count', () => {
    render(<UuidTool />)
    fireEvent.change(screen.getByLabelText('Number of UUIDs'), { target: { value: '0' } })
    fireEvent.click(screen.getByRole('button', { name: 'Generate' }))
    expect(screen.getByRole('alert')).toHaveTextContent('bad count')
    expect(screen.getByLabelText('Output')).toHaveValue('')
  })

  it('keeps the copy button disabled until something is generated', () => {
    render(<UuidTool />)
    expect(screen.getByRole('button', { name: 'Copy result' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Generate' }))
    expect(screen.getByRole('button', { name: 'Copy result' })).toBeEnabled()
  })
})
