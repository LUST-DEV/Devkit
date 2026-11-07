import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { JwtTool } from './JwtTool'

function b64url(value: unknown): string {
  return btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const TOKEN = `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url({ sub: '42', exp: 1516239022 })}.c2ln`

describe('JwtTool', () => {
  it('always shows the signature warning', () => {
    render(<JwtTool />)
    expect(screen.getByRole('note')).toHaveTextContent('does not verify the signature')
  })

  it('shows the decoded header and payload', () => {
    render(<JwtTool />)
    fireEvent.change(screen.getByLabelText('Token'), { target: { value: TOKEN } })
    expect(screen.getByLabelText('Header')).toHaveValue('{\n  "alg": "HS256",\n  "typ": "JWT"\n}')
    expect(screen.getByLabelText('Payload')).toHaveValue('{\n  "sub": "42",\n  "exp": 1516239022\n}')
    expect(screen.getByText(/2018-01-18T01:30:22.000Z/)).toBeInTheDocument()
  })

  it('shows an explicit error for a malformed token', () => {
    render(<JwtTool />)
    fireEvent.change(screen.getByLabelText('Token'), { target: { value: 'abc.def' } })
    expect(screen.getByRole('alert')).toHaveTextContent('three parts')
    expect(screen.getByLabelText('Header')).toHaveValue('')
  })

  it('clears the token and the decoded values', () => {
    render(<JwtTool />)
    fireEvent.change(screen.getByLabelText('Token'), { target: { value: TOKEN } })
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.getByLabelText('Token')).toHaveValue('')
    expect(screen.getByLabelText('Payload')).toHaveValue('')
  })
})
