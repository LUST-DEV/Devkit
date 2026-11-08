// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { convertInput, detectTimeZone, getOffsetMs, getTimeZones } from './timestamp'

function expectDetails(result: ReturnType<typeof convertInput>) {
  if (!result.ok) {
    throw new Error(`Expected success but got error: ${result.error}`)
  }
  return result.details
}

describe('convertInput with a timestamp', () => {
  it('converts zero to the Unix epoch', () => {
    const details = expectDetails(convertInput('0'))
    expect(details.iso).toBe('1970-01-01T00:00:00.000Z')
    expect(details.seconds).toBe(0)
    expect(details.milliseconds).toBe(0)
  })

  it('detects seconds automatically', () => {
    const details = expectDetails(convertInput('1516239022'))
    expect(details.iso).toBe('2018-01-18T01:30:22.000Z')
    expect(details.interpretedAs).toBe('seconds')
    expect(details.milliseconds).toBe(1516239022000)
  })

  it('detects milliseconds automatically', () => {
    const details = expectDetails(convertInput('1516239022000'))
    expect(details.iso).toBe('2018-01-18T01:30:22.000Z')
    expect(details.interpretedAs).toBe('milliseconds')
  })

  it('honours an explicit unit', () => {
    // 1516239022 ms is 1516239.022 s: 17 days (1468800 s) + 47439 s (13:10:39) after the epoch.
    expect(expectDetails(convertInput('1516239022', { unit: 'milliseconds' })).iso).toBe('1970-01-18T13:10:39.022Z')
    expect(expectDetails(convertInput('1500', { unit: 'seconds' })).milliseconds).toBe(1500000)
    expect(expectDetails(convertInput('1500', { unit: 'milliseconds' })).iso).toBe('1970-01-01T00:00:01.500Z')
  })

  it('supports decimal seconds and negative values', () => {
    expect(expectDetails(convertInput('1.5')).milliseconds).toBe(1500)
    expect(expectDetails(convertInput('-1')).iso).toBe('1969-12-31T23:59:59.000Z')
  })

  it('rejects values outside the supported range', () => {
    expect(convertInput('99999999999999999999', { unit: 'milliseconds' }).ok).toBe(false)
  })
})

describe('convertInput with a date', () => {
  it('parses an ISO date in UTC', () => {
    expect(expectDetails(convertInput('2018-01-18T01:30:22Z')).milliseconds).toBe(1516239022000)
  })

  it('parses an ISO date with an offset', () => {
    expect(expectDetails(convertInput('2018-01-18T02:30:22+01:00')).milliseconds).toBe(1516239022000)
    expect(expectDetails(convertInput('2018-01-17T20:30:22-05:00')).milliseconds).toBe(1516239022000)
  })

  it('reads a date without offset in the selected time zone', () => {
    expect(expectDetails(convertInput('2018-01-18 01:30:22', { timeZone: 'UTC' })).milliseconds).toBe(1516239022000)
    expect(expectDetails(convertInput('2018-01-18T10:30:22', { timeZone: 'Asia/Tokyo' })).milliseconds).toBe(1516239022000)
    expect(expectDetails(convertInput('2018-01-17T20:30:22', { timeZone: 'America/New_York' })).milliseconds).toBe(1516239022000)
  })

  it('handles daylight saving time', () => {
    const summer = expectDetails(convertInput('2018-07-01T12:00:00', { timeZone: 'America/New_York' }))
    expect(summer.milliseconds).toBe(Date.UTC(2018, 6, 1, 16, 0, 0))
    const winter = expectDetails(convertInput('2018-12-01T12:00:00', { timeZone: 'America/New_York' }))
    expect(winter.milliseconds).toBe(Date.UTC(2018, 11, 1, 17, 0, 0))
  })

  it('accepts a date without a time and fractional seconds', () => {
    expect(expectDetails(convertInput('2018-01-18', { timeZone: 'UTC' })).iso).toBe('2018-01-18T00:00:00.000Z')
    expect(expectDetails(convertInput('2018-01-18T01:30:22.5Z')).milliseconds).toBe(1516239022500)
  })

  it('rejects dates and times that do not exist', () => {
    for (const input of ['2018-13-01', '2018-02-30', '2018-04-31', '2018-01-18T24:00:00Z', '2018-01-18T01:60:00Z']) {
      expect(convertInput(input).ok).toBe(false)
    }
  })

  it('rejects unrecognized text', () => {
    for (const input of ['abc', '18/01/2018', '1e30', '2018-01-18Z']) {
      expect(convertInput(input).ok).toBe(false)
    }
  })
})

describe('convertInput presentation', () => {
  it('shows the time in the selected time zone with its offset', () => {
    const details = expectDetails(convertInput('1516239022', { timeZone: 'Asia/Tokyo', locale: 'en-US' }))
    expect(details.offset).toBe('+09:00')
    expect(details.zoned).toContain('10:30:22')
    expect(expectDetails(convertInput('1516239022', { timeZone: 'UTC' })).offset).toBe('+00:00')
    expect(expectDetails(convertInput('1516239022', { timeZone: 'America/New_York' })).offset).toBe('-05:00')
  })

  it('falls back to English for an unknown locale', () => {
    expect(convertInput('0', { locale: 'not a locale' }).ok).toBe(true)
  })

  it('reports an unknown time zone', () => {
    expect(convertInput('0', { timeZone: 'Mars/Olympus' })).toEqual({ ok: false, error: 'Unknown time zone.' })
  })

  it('reports an empty input', () => {
    expect(convertInput('  ')).toEqual({ ok: false, error: 'Enter a timestamp or a date.' })
  })
})

describe('time zone helpers', () => {
  it('computes UTC offsets', () => {
    expect(getOffsetMs(1516239022000, 'UTC')).toBe(0)
    expect(getOffsetMs(1516239022000, 'Asia/Tokyo')).toBe(9 * 3600000)
  })

  it('lists time zones including UTC', () => {
    expect(getTimeZones()).toContain('UTC')
  })

  it('detects a usable time zone', () => {
    expect(detectTimeZone().length).toBeGreaterThan(0)
  })
})
