import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('renders the product name and slogan', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'DEVKIT' })).toBeInTheDocument()
    expect(screen.getByText('One workspace. Every developer tool.')).toBeInTheDocument()
  })
})
