import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PageSkeleton } from './PageSkeleton'

describe('PageSkeleton', () => {
  it('announces loading to assistive technology', () => {
    render(<PageSkeleton />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading')
  })
})
