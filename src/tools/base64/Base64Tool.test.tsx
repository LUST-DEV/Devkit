import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Base64Tool } from './Base64Tool'

describe('Base64Tool', () => {
  it('encodes the input as the user types', () => {
    render(<Base64Tool />)
    fireEvent.change(screen.getByLabelText('Input'), { target: { value: 'hello' } })
    expect(screen.getByLabelText('Output')).toHaveValue('aGVsbG8=')
  })

  it('decodes in decode mode', () => {
    render(<Base64Tool />)
    fireEvent.click(screen.getByRole('radio', { name: 'Decode' }))
    fireEvent.change(screen.getByLabelText('Input'), { target: { value: 'aGVsbG8=' } })
    expect(screen.getByLabelText('Output')).toHaveValue('hello')
  })

  it('shows an explicit error for invalid Base64', () => {
    render(<Base64Tool />)
    fireEvent.click(screen.getByRole('radio', { name: 'Decode' }))
    fireEvent.change(screen.getByLabelText('Input'), { target: { value: 'a$b=' } })
    expect(screen.getByRole('alert')).toHaveTextContent('outside the Base64 alphabet')
    expect(screen.getByLabelText('Output')).toHaveValue('')
  })

  it('offers the URL-safe option only when encoding', () => {
    render(<Base64Tool />)
    expect(screen.getByRole('checkbox', { name: /URL-safe/ })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: 'Decode' }))
    expect(screen.queryByRole('checkbox', { name: /URL-safe/ })).not.toBeInTheDocument()
  })

  it('clears the input', () => {
    render(<Base64Tool />)
    fireEvent.change(screen.getByLabelText('Input'), { target: { value: 'hello' } })
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.getByLabelText('Input')).toHaveValue('')
    expect(screen.getByLabelText('Output')).toHaveValue('')
  })
})
