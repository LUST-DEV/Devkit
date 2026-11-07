import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { JsonTool } from './JsonTool'

describe('JsonTool', () => {
  it('formats valid JSON and reports it as valid', () => {
    render(<JsonTool />)
    fireEvent.change(screen.getByLabelText('Input'), { target: { value: '{"a":1}' } })
    expect(screen.getByLabelText('Output')).toHaveValue('{\n  "a": 1\n}')
    expect(screen.getByText('Valid JSON.')).toBeInTheDocument()
  })

  it('minifies in minify mode', () => {
    render(<JsonTool />)
    fireEvent.click(screen.getByRole('radio', { name: 'Minify' }))
    fireEvent.change(screen.getByLabelText('Input'), { target: { value: '{ "a": 1 }' } })
    expect(screen.getByLabelText('Output')).toHaveValue('{"a":1}')
  })

  it('applies the selected indentation', () => {
    render(<JsonTool />)
    fireEvent.change(screen.getByLabelText('Input'), { target: { value: '{"a":1}' } })
    fireEvent.change(screen.getByLabelText('Indentation'), { target: { value: '4' } })
    expect(screen.getByLabelText('Output')).toHaveValue('{\n    "a": 1\n}')
  })

  it('shows an explicit error for invalid JSON', () => {
    render(<JsonTool />)
    fireEvent.change(screen.getByLabelText('Input'), { target: { value: '{"a":1,}' } })
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid JSON')
    expect(screen.getByLabelText('Output')).toHaveValue('')
  })

  it('clears the input', () => {
    render(<JsonTool />)
    fireEvent.change(screen.getByLabelText('Input'), { target: { value: '[1]' } })
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.getByLabelText('Input')).toHaveValue('')
    expect(screen.getByLabelText('Output')).toHaveValue('')
  })
})
