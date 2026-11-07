import { describe, expect, it } from 'vitest'
import { getToolById, tools } from './registry'

describe('tool registry', () => {
  it('contains the six MVP tools', () => {
    expect(tools.map((tool) => tool.id)).toEqual(['json', 'base64', 'uuid', 'jwt', 'timestamp', 'hash'])
  })

  it('uses unique ids and routes', () => {
    expect(new Set(tools.map((tool) => tool.id)).size).toBe(tools.length)
    expect(new Set(tools.map((tool) => tool.route)).size).toBe(tools.length)
  })

  it('builds every route from its id', () => {
    for (const tool of tools) {
      expect(tool.route).toBe(`/tools/${tool.id}`)
    }
  })

  it('provides name, description and icon for every tool', () => {
    for (const tool of tools) {
      expect(tool.name.length).toBeGreaterThan(0)
      expect(tool.description.length).toBeGreaterThan(0)
      expect(tool.icon).toBeDefined()
    }
  })

  it('finds a tool by id and returns undefined for unknown ids', () => {
    expect(getToolById('jwt')?.name).toBe('JWT Decoder')
    expect(getToolById('unknown')).toBeUndefined()
  })
})
