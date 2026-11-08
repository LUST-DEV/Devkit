import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TimestampTool } from './TimestampTool'

function setup() {
  render(<TimestampTool />)
  fireEvent.change(screen.getByLabelText('Time zone'), { target: { value: 'UTC' } })
  fireEvent.change(screen.getByLabelText('Regional format'), { target: { value: 'en-US' } })
}

describe('TimestampTool', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('converts a timestamp to an ISO date in UTC', () => {
    setup()
    fireEvent.change(screen.getByLabelText('Timestamp or date'), { target: { value: '1516239022' } })
    expect(screen.getByText('2018-01-18T01:30:22.000Z')).toBeInTheDocument()
    expect(screen.getByText('1516239022000')).toBeInTheDocument()
  })

  it('converts a date to a timestamp', () => {
    setup()
    fireEvent.change(screen.getByLabelText('Timestamp or date'), { target: { value: '2018-01-18 01:30:22' } })
    expect(screen.getByText('1516239022')).toBeInTheDocument()
  })

  it('applies the selected unit', () => {
    setup()
    fireEvent.change(screen.getByLabelText('Number unit'), { target: { value: 'milliseconds' } })
    fireEvent.change(screen.getByLabelText('Timestamp or date'), { target: { value: '1516239022' } })
    // 1516239022 ms is 17 days, 13 h 10 min 39.022 s after the epoch.
    expect(screen.getByText('1970-01-18T13:10:39.022Z')).toBeInTheDocument()
  })

  it('shows an explicit error for unrecognized input', () => {
    setup()
    fireEvent.change(screen.getByLabelText('Timestamp or date'), { target: { value: 'abc' } })
    expect(screen.getByRole('alert')).toHaveTextContent('Unrecognized input')
  })

  it('fills the input with the current time', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1516239022000)
    setup()
    fireEvent.click(screen.getByRole('button', { name: 'Now' }))
    expect(screen.getByLabelText('Timestamp or date')).toHaveValue('1516239022000')
    expect(screen.getByText('2018-01-18T01:30:22.000Z')).toBeInTheDocument()
  })
})
