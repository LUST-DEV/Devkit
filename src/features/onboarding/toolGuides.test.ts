// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { tools } from '../../tools/registry'
import { getToolGuide } from './toolGuides'
import { TOUR_STEPS } from './tourSteps'

describe('tool guides', () => {
  it('has a guide with at least two tips for every tool of the registry', () => {
    for (const tool of tools) {
      expect(getToolGuide(tool.id).length).toBeGreaterThanOrEqual(2)
    }
  })

  it('falls back to a generic tip for an unknown tool', () => {
    expect(getToolGuide('unknown')).toHaveLength(1)
  })
})

describe('tour steps', () => {
  it('has unique ids', () => {
    expect(new Set(TOUR_STEPS.map((step) => step.id)).size).toBe(TOUR_STEPS.length)
  })

  it('starts with a welcome and ends with a closing step', () => {
    expect(TOUR_STEPS[0].id).toBe('welcome')
    expect(TOUR_STEPS[TOUR_STEPS.length - 1].id).toBe('done')
  })
})
