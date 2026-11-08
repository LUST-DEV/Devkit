import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getToolById } from '../../tools/registry'
import { ToolGuide } from './ToolGuide'

const tool = getToolById('json')
if (!tool) {
  throw new Error('The json tool is missing from the registry')
}

describe('ToolGuide', () => {
  it('opens the guide of the tool from the floating button', () => {
    render(<ToolGuide tool={tool} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Guide' }))
    const dialog = screen.getByRole('dialog', { name: 'JSON Formatter & Validator guide' })
    expect(dialog).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(2)
  })

  it('closes with the button and gives the focus back', () => {
    render(<ToolGuide tool={tool} />)
    const trigger = screen.getByRole('button', { name: 'Guide' })
    fireEvent.click(trigger)
    expect(screen.getByRole('button', { name: 'Got it' })).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('closes with Escape', () => {
    render(<ToolGuide tool={tool} />)
    fireEvent.click(screen.getByRole('button', { name: 'Guide' }))
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
